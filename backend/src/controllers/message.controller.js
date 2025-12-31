import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Group from "../models/group.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    const groups = await Group.find({ members: { $in: [loggedInUserId] } });
    
    res.status(200).json({ users: filteredUsers, groups });
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createGroup = async (req, res) => {
  try {
    const { name, members, groupPic } = req.body;
    const admin = req.user._id;

    let groupPicUrl = "";
    if (groupPic) {
      const uploadResponse = await cloudinary.uploader.upload(groupPic);
      groupPicUrl = uploadResponse.secure_url;
    }

    const allMembers = [...new Set([...members, admin.toString()])];

    const newGroup = new Group({
      name,
      admin,
      members: allMembers,
      groupPic: groupPicUrl,
    });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error in createGroup: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, groupPic } = req.body;
    const adminId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== adminId.toString()) {
      return res.status(403).json({ message: "Only admin can update group settings" });
    }

    let groupPicUrl = group.groupPic;
    if (groupPic && groupPic.startsWith("data:image")) {
      const uploadResponse = await cloudinary.uploader.upload(groupPic);
      groupPicUrl = uploadResponse.secure_url;
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { name: name || group.name, groupPic: groupPicUrl },
      { new: true }
    ).populate("members", "-password");

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Error in updateGroup: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const manageGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId, action } = req.body; 
    const adminId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== adminId.toString()) {
      return res.status(403).json({ message: "Only admin can manage members" });
    }

    let updatedMembers = [...group.members];

    if (action === "add") {
      if (!updatedMembers.includes(memberId)) updatedMembers.push(memberId);
    } else if (action === "remove") {
      if (memberId === group.admin.toString()) {
        return res.status(400).json({ message: "Cannot remove the admin" });
      }
      updatedMembers = updatedMembers.filter((id) => id.toString() !== memberId);
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { members: updatedMembers },
      { new: true }
    ).populate("members", "-password");

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Error in manageGroupMembers: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: chatTargetId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: chatTargetId },
        { senderId: chatTargetId, receiverId: myId },
        { groupId: chatTargetId },
      ],
    }).sort({ createdAt: 1 }).populate("senderId", "fullName profilePic");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, audio, isGroup } = req.body;
    const { id: targetId } = req.params;
    const senderId = req.user._id;

    let imageUrl, audioUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    if (audio) {
      const uploadResponse = await cloudinary.uploader.upload(audio, {
        resource_type: "video",
        folder: "chat_audio",
      });
      audioUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      text,
      image: imageUrl,
      audio: audioUrl,
      ...(isGroup ? { groupId: targetId } : { receiverId: targetId }),
    });

    await newMessage.save();
    const populatedMessage = await newMessage.populate("senderId", "fullName profilePic");

    if (isGroup) {
      io.to(targetId).emit("newMessage", populatedMessage);
    } else {
      const receiverSocketId = getRecieverSocketId(targetId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", populatedMessage);
      }
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendMessage: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

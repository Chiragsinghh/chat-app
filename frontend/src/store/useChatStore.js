import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  groups: [],
  selectedChat: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      // Expecting { users: [...], groups: [...] } from backend
      set({ users: res.data.users, groups: res.data.groups });
    } catch (error) {
      toast.error("Failed to fetch users and groups");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (chatId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${chatId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedChat, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedChat._id}`, {
        ...messageData,
        isGroup: !!selectedChat.isGroup,
      });
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  createGroup: async (groupData) => {
    try {
      const res = await axiosInstance.post("/messages/groups", groupData);
      set({ groups: [...get().groups, res.data] });
      toast.success("Group created successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedChat } = get();
    if (!selectedChat) return;

    const socket = useAuthStore.getState().socket;

    if (selectedChat.isGroup) {
      socket.emit("joinGroup", selectedChat._id);
    }

    socket.on("newMessage", (newMessage) => {
      const isRelevant = selectedChat.isGroup
        ? newMessage.groupId === selectedChat._id
        : newMessage.senderId._id === selectedChat._id || newMessage.senderId === selectedChat._id;

      if (!isRelevant) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const { selectedChat } = get();
    const socket = useAuthStore.getState().socket;
    if (selectedChat?.isGroup) {
      socket.emit("leaveGroup", selectedChat._id);
    }
    socket.off("newMessage");
  },

  setSelectedChat: (selectedChat) => set({ selectedChat }),
}));

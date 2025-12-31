import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { X, Camera, UserMinus, UserPlus, Settings2 } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const GroupSettings = ({ isOpen, onClose }) => {
  const { selectedChat, setSelectedChat, users, groups, getUsers } = useChatStore();
  const { authUser } = useAuthStore();
  
  const [name, setName] = useState(selectedChat?.name || "");
  const [groupPic, setGroupPic] = useState(selectedChat?.groupPic || "");
  const fileInputRef = useRef(null);

  if (!isOpen || !selectedChat?.isGroup) return null;

  const isAdmin = selectedChat.admin === authUser._id;

  const handleUpdateGroup = async () => {
    try {
      const res = await axiosInstance.put(`/messages/groups/${selectedChat._id}`, { name, groupPic });
      setSelectedChat(res.data);
      getUsers();
      toast.success("Group updated!");
    } catch (error) {
      toast.error("Failed to update group");
    }
  };

  const handleMemberAction = async (memberId, action) => {
    try {
      const res = await axiosInstance.post(`/messages/groups/${selectedChat._id}/members`, { memberId, action });
      setSelectedChat(res.data);
      getUsers();
      toast.success(`Member ${action === "add" ? "added" : "removed"}`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setGroupPic(reader.result);
  };

  return (
    <div className="w-80 border-l border-base-300 bg-base-100 flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-base-300 flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2"><Settings2 className="size-4"/> Group Info</h3>
        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle"><X /></button>
      </div>

      <div className="p-4 space-y-6">
        {/* Pic & Name */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <img src={groupPic || "/avatar.png"} className="size-24 rounded-full object-cover border-4 border-base-300" />
            {isAdmin && (
              <button onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 bg-primary p-2 rounded-full"><Camera className="size-4 text-white"/></button>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} />
          </div>
          {isAdmin ? (
            <div className="flex flex-col gap-2 w-full">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered input-sm text-center" />
              <button onClick={handleUpdateGroup} className="btn btn-primary btn-xs">Save Details</button>
            </div>
          ) : (
            <h2 className="text-xl font-bold">{selectedChat.name}</h2>
          )}
        </div>

        {/* Members List */}
        <div>
          <h4 className="text-sm font-bold text-zinc-500 mb-3 uppercase tracking-wider">Members</h4>
          <div className="space-y-3">
            {selectedChat.members?.map((memberId) => {
                const member = users.find(u => u._id === memberId) || (memberId === authUser._id ? authUser : null);
                if(!member) return null;
                return (
                    <div key={member._id} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <img src={member.profilePic || "/avatar.png"} className="size-8 rounded-full object-cover" />
                            <span className="text-sm font-medium truncate w-32">{member.fullName}</span>
                            {member._id === selectedChat.admin && <span className="badge badge-xs badge-outline opacity-50">Admin</span>}
                        </div>
                        {isAdmin && member._id !== authUser._id && (
                            <button onClick={() => handleMemberAction(member._id, "remove")} className="btn btn-ghost btn-xs text-error"><UserMinus className="size-4"/></button>
                        )}
                    </div>
                )
            })}
          </div>
        </div>

        {/* Add Members (Admin Only) */}
        {isAdmin && (
            <div>
                 <h4 className="text-sm font-bold text-zinc-500 mb-3 uppercase tracking-wider">Add People</h4>
                 <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-2">
                    {users.filter(u => !selectedChat.members.includes(u._id)).map(user => (
                        <div key={user._id} className="flex items-center justify-between">
                             <span className="text-xs truncate">{user.fullName}</span>
                             <button onClick={() => handleMemberAction(user._id, "add")} className="btn btn-ghost btn-xs text-primary"><UserPlus className="size-4"/></button>
                        </div>
                    ))}
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default GroupSettings;

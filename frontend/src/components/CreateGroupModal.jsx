import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatstore";
import { useAuthStore } from "../store/useAuthStore";
import { X, Camera, UserPlus, Search } from "lucide-react";
import toast from "react-hot-toast";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const { users, createGroup } = useChatStore();
  const { authUser } = useAuthStore();
  
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupPic, setGroupPic] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setGroupPic(base64Image);
    };
  };

  const toggleMember = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return toast.error("Group name is required");
    if (selectedMembers.length < 1) return toast.error("Select at least one member");

    const success = await createGroup({
      name: groupName,
      members: selectedMembers,
      groupPic: groupPic,
    });

    if (success) {
      setGroupName("");
      setSelectedMembers([]);
      setGroupPic(null);
      onClose();
    }
  };

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-base-100 w-full max-w-md rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-base-300 flex items-center justify-between">
          <h3 className="text-lg font-bold">Create New Group</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Group Picture */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={groupPic || "/avatar.png"}
                alt="Group preview"
                className="size-24 rounded-full object-cover border-4 border-base-200"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-base-content p-2 rounded-full cursor-pointer hover:scale-105 transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-5 h-5 text-base-100" />
              </button>
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <p className="text-sm text-zinc-400">Upload Group Icon</p>
          </div>

          {/* Group Name */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Group Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g. Family Chat"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          {/* Members Selection */}
          <div className="space-y-3">
            <label className="label">
              <span className="label-text font-medium">Add Members ({selectedMembers.length})</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="text"
                className="input input-bordered input-sm w-full pl-9"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1 border border-base-300 rounded-lg p-2">
              {filteredUsers.map((user) => (
                <label
                  key={user._id}
                  className="flex items-center gap-3 p-2 hover:bg-base-200 rounded-md cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={selectedMembers.includes(user._id)}
                    onChange={() => toggleMember(user._id)}
                  />
                  <img src={user.profilePic || "/avatar.png"} className="size-8 rounded-full object-cover" />
                  <span className="text-sm font-medium">{user.fullName}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 border-t border-base-300">
          <button
            className="btn btn-primary w-full"
            disabled={!groupName.trim() || selectedMembers.length === 0}
            onClick={handleCreateGroup}
          >
            <UserPlus className="size-5 mr-2" />
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;

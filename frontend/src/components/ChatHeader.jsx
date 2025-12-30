import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatstore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="px-4 py-3 border-b border-white/20 bg-white/60 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        
        {/* Left */}
        <div className="flex items-center gap-4">
          
          {/* Avatar */}
          <div className="relative">
            <div className="size-11 rounded-full overflow-hidden ring-2 ring-white shadow-md">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Online indicator */}
            {isOnline && (
              <span
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full 
                           bg-green-500 ring-2 ring-white animate-pulse"
              />
            )}
          </div>

          {/* User info */}
          <div className="leading-tight">
            <h3 className="font-semibold text-base">
              {selectedUser.fullName}
            </h3>
            <p
              className={`text-sm ${
                isOnline ? "text-green-600" : "text-gray-400"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full hover:bg-black/5 transition"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;

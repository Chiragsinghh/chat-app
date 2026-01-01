import { X, Settings2 } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";


const ChatHeader = ({ onShowSettings }) => {
  const { selectedChat, setSelectedChat } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedChat) return null;

  const isGroup = !!selectedChat.isGroup;
  const isOnline = !isGroup && onlineUsers.includes(selectedChat._id);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img 
                src={selectedChat.profilePic || selectedChat.groupPic || "/avatar.png"} 
                alt={selectedChat.fullName || selectedChat.name} 
                className="object-cover size-10 rounded-full"
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium truncate">
              {selectedChat.fullName || selectedChat.name}
            </h3>
            <p className="text-sm text-base-content/70">
              {isGroup ? (
                `${selectedChat.members?.length || 0} members`
              ) : (
                isOnline ? "Online" : "Offline"
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Settings Button */}
          {isGroup && (
            <button 
              onClick={onShowSettings} 
              className="btn btn-ghost btn-sm btn-circle"
              type="button"
            >
              <Settings2 className="size-5" />
            </button>
          )}

          <button onClick={() => setSelectedChat(null)} className="btn btn-ghost btn-sm btn-circle">
            <X className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

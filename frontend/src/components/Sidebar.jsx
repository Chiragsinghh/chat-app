import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, Plus } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";

const Sidebar = () => {
  const { getUsers, users, groups, selectedChat, setSelectedChat, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  const filteredItems = [
    ...(users || []).map(u => ({ ...u, type: 'user' })),
    ...(groups || []).map(g => ({ ...g, type: 'group', fullName: g.name, profilePic: g.groupPic }))
  ].filter(item => item.fullName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Chats</span>
          </div>
          <button 
            onClick={() => setIsGroupModalOpen(true)}
            className="btn btn-ghost btn-sm btn-circle hidden lg:flex"
          >
            <Plus className="size-5" />
          </button>
        </div>

        <div className="relative mt-2 w-full">
          <input
            type="text"
            placeholder="Search..."
            className="input input-sm w-full pl-8 pr-2 rounded-lg border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-base-content/40 size-4" />
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredItems.map((item) => (
          <button
            key={item._id}
            onClick={() => setSelectedChat(item)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedChat?._id === item._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={item.profilePic || "/avatar.png"}
                alt={item.fullName}
                className="size-12 object-cover rounded-full"
              />
              {item.type === 'user' && onlineUsers?.includes(item._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{item.fullName}</div>
              <div className="text-sm text-zinc-400">
                {item.type === 'group' ? "Group Chat" : (onlineUsers?.includes(item._id) ? "Online" : "Offline")}
              </div>
            </div>
          </button>
        ))}
      </div>
      <CreateGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} />
    </aside>
  );
};

export default Sidebar;

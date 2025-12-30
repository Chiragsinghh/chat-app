import { useEffect } from "react";
import { useChatStore } from "../store/useChatstore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 bg-base-100 flex flex-col">
      
      {/* Header */}
      <div className="border-b border-base-300 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="size-5 text-primary" />
          </div>
          <span className="font-semibold hidden lg:block">Contacts</span>
        </div>
      </div>

      {/* Users */}
      <div className="flex-1 overflow-y-auto py-2">
        {(users || []).map((user) => {
          const isSelected = selectedUser?._id === user._id;
          const isOnline = onlineUsers?.includes(user._id);

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full px-3 py-2.5 flex items-center gap-3
                transition-all duration-150
                hover:bg-base-200
                ${isSelected ? "bg-base-200 border-l-4 border-primary" : ""}
              `}
            >
              {/* Avatar */}
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-11 rounded-full object-cover"
                />

                {/* Online Dot */}
                {isOnline && (
                  <span className="absolute bottom-0 right-0 size-3 
                    bg-green-500 rounded-full ring-2 ring-base-100"
                  />
                )}
              </div>

              {/* Info */}
              <div className="hidden lg:block min-w-0 text-left">
                <p className="font-medium truncate leading-tight">
                  {user.fullName}
                </p>
                <p
                  className={`text-xs ${
                    isOnline ? "text-green-500" : "text-base-content/50"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;

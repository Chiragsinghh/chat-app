import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="fixed top-0 z-40 w-full border-b border-white/20 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="size-9 rounded-xl bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">
              Chatty
            </h1>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            <Link
              to="/settings"
              className="flex items-center gap-2 px-3 py-2 rounded-lg 
                         text-sm font-medium hover:bg-black/5 transition"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg 
                             text-sm font-medium hover:bg-black/5 transition"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg 
                             text-sm font-medium text-red-500 hover:bg-red-500/10 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

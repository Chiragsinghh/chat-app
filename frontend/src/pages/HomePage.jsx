import { useChatStore } from "../store/useChatstore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-2 lg:px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-5rem)] flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 relative">
            {/* Chat container */}
            {selectedUser ? (
              <ChatContainer />
            ) : (
              <NoChatSelected />
            )}
          </div>

          {/* Right-side welcome section: hidden on small screens */}
          <div className="hidden lg:flex w-1/3 bg-base-200 items-center justify-center p-6">
            {!selectedUser && (
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Welcome to Chatty!</h2>
                <p className="text-base-content/60">
                  Select a user from the sidebar to start chatting
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

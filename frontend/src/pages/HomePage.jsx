import { useChatStore } from "../store/useChatstore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-16 px-0 sm:px-4">
        <div className="bg-base-100 w-full max-w-6xl h-[calc(100vh-4rem)] sm:h-[calc(100vh-6rem)] overflow-hidden">
          <div className="flex h-full">
            
            {/* Sidebar */}
            <div
              className={`
                ${selectedUser ? "hidden lg:block" : "block"}
                h-full
              `}
            >
              <Sidebar />
            </div>

            {/* Chat Area */}
            <div className="flex-1 h-full">
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

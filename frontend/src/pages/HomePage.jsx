import { useChatStore } from "../store/useChatstore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-purple-100 flex justify-center pt-20 px-4">
      <div className="w-full max-w-7xl h-full flex rounded-3xl overflow-hidden shadow-2xl bg-white/70 backdrop-blur-xl border border-white/40">
        
        {/* Sidebar */}
        <div className="w-72 border-r border-white/30 bg-white/60 backdrop-blur-xl">
          <Sidebar />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;


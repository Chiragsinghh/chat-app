import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatstore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } = useChatStore();
  const { authUser, theme } = useAuthStore(); // get current theme
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) getMessages(selectedUser._id);
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) return null;

  if (isMessagesLoading) {
    return (
      <div className="flex flex-col h-full">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  // Define background for chat area per theme
  const chatBgMap = {
    light: "bg-gray-100",
    dark: "bg-gray-900",
    blue: "bg-blue-50",
    green: "bg-green-50",
    purple: "bg-purple-50",
  };
  const chatBubbleMap = {
    light: { sent: "bg-indigo-500 text-white rounded-br-none", received: "bg-white text-gray-800 rounded-bl-none" },
    dark: { sent: "bg-purple-500 text-white rounded-br-none", received: "bg-gray-800 text-gray-100 rounded-bl-none" },
    blue: { sent: "bg-blue-500 text-white rounded-br-none", received: "bg-blue-200 text-gray-800 rounded-bl-none" },
    green: { sent: "bg-green-600 text-white rounded-br-none", received: "bg-green-200 text-gray-800 rounded-bl-none" },
    purple: { sent: "bg-purple-500 text-white rounded-br-none", received: "bg-purple-200 text-gray-800 rounded-bl-none" },
  };

  const bgClass = chatBgMap[theme] || chatBgMap.light;
  const bubbleClasses = chatBubbleMap[theme] || chatBubbleMap.light;

  return (
    <div className={`flex flex-col h-full ${bgClass} backdrop-blur-xl`}>
      <ChatHeader />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-transparent">
        {messages.map((message) => {
          const isOwn = message.senderId === authUser._id;

          return (
            <div key={message._id} className={`chat ${isOwn ? "chat-end" : "chat-start"}`}>
              <div className="chat-image avatar">
                <div className="size-10 rounded-full ring-2 ring-white shadow">
                  <img
                    src={
                      isOwn
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt=""
                  />
                </div>
              </div>

              <div className="chat-header text-xs opacity-60 mb-1">
                {formatMessageTime(message.createdAt)}
              </div>

              <div className={`chat-bubble max-w-xs sm:max-w-md text-sm leading-relaxed px-4 py-2 shadow-md ${isOwn ? bubbleClasses.sent : bubbleClasses.received}`}>
                {message.image && (
                  <img
                    src={message.image}
                    alt="attachment"
                    className="rounded-lg mb-2 max-w-[220px] hover:scale-105 transition"
                  />
                )}
                {message.text}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;

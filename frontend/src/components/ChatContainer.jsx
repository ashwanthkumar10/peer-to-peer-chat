import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
// import ChatProfileDetails from "./ChatProfileDetails"; 

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  
  const { authUser } = useAuthStore();
  const messageEndRef = useRef();

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    // Store token in localStorage when component mounts
    localStorage.setItem("token", "your_test_token");
    console.log("Token stored:", localStorage.getItem("token"));
  }, []);
  
  if (!selectedUser) {
    return <div className="flex-1 flex items-center justify-center text-gray-500">Select a user to start chatting</div>;
  }

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <ChatHeader />
        {isMessagesLoading ? (
          <MessageSkeleton />
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => {
              const isSentByMe = message.senderId === authUser._id;
              return (
                <div key={message._id} ref={messageEndRef} className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}>
                  <div className={`p-3 rounded-lg shadow-md ${isSentByMe ? "bg-blue-200" : "bg-white"} max-w-xs`}>
                    <p className="text-sm">{message.text}</p>
                    <div className="text-xs opacity-50 mt-1 text-right">{formatMessageTime(message.createdAt)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <MessageInput />
      </div>

      {/* ✅ Right Sidebar - ChatProfileDetails */}
      {/* <div className={`w-80 border-l border-gray-300 transition-all ${selectedUser ? "block" : "hidden"} lg:block`}>
        <ChatProfileDetails />
      </div> */}
    </div>
  );
};

export default ChatContainer;

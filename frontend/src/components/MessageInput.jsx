import React, { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState(""); // Initialize as an empty string
  const { sendMessage } = useChatStore(); // Ensure sendMessage exists in the store

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Cannot send an empty message!");
      return;
    }

    try {
      await sendMessage({
        text: text.trim(),
      });

      // Clear form
      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="w-full px-4 pb-4"> {/* Added left and right padding */}
      <div className="w-full p-2 flex items-center rounded-xl shadow-sm bg-white mx-auto max-w-[1144px]">
        {/* Input form */}
        <form onSubmit={handleSendMessage} className="flex w-full items-center">
          <input
            type="text"
            className="flex-1 bg-transparent px-4 py-2 text-[#707991] placeholder-[#707991] outline-none"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Send button as an image */}
          <button type="submit" disabled={!text.trim()} className="ml-2">
            <img src="/Vector.png" alt="Send" className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;

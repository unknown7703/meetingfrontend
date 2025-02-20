import React from "react";

interface ChatProps {
  sender: "user" | "bot";
  message: string;
}

// Chat component to display individual chat messages
const Chat: React.FC<ChatProps> = ({ sender, message }) => {
  const isUser = sender === "user";
  const chatContainerClass = isUser ? "justify-end" : "justify-start";
  const chatBubbleClass = isUser ? "text-right bg-blue-600 dark:bg-[#2F2F2F] text-white" : "bg-gray-200 text-left text-black";
  const chatBubbleUserName = isUser ? "User" : "AI";

  return (
    <div className={`flex ${chatContainerClass}`}>
      <div className={`max-w-xs p-3 rounded-lg drop-shadow-md ${chatBubbleClass}`}>
        <p className="font-bold">{chatBubbleUserName}</p>
        {message}
      </div>
    </div>
  );
};

export default Chat;

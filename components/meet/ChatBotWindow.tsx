"use client"

import React, { useEffect, useRef, useState } from "react";
import Chat from "./Chat";

interface ChatMessage {
  sender: "user" | "bot";
  message: string;
}

interface ChatBotWindowProps {
  chatHistory: ChatMessage[];
  addMessageToChatHistory: (sender: "user" | "bot", message: string) => void;
  askAI: () => void;
}

const ChatBotWindow: React.FC<ChatBotWindowProps> = ({ chatHistory, addMessageToChatHistory, askAI }) => {
  const [userInput, setUserInput] = useState<string>("");
  const chatRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (userInput.trim() === "") {
      askAI();
      return;
    }

    addMessageToChatHistory("user", userInput);
    setUserInput("");

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_FASTAPI_URL as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: userInput }),
      });

      const data = await response.json();
      const botMessage: string = data.response || "No response";

      addMessageToChatHistory("bot", botMessage);
    } catch (error) {
      addMessageToChatHistory("bot", "Error fetching response");
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="w-[100%] mx-auto h-[90%] rounded-lg flex flex-col justify-between p-4 bg-white shadow-lg dark:bg-[#212121]">
      <div ref={chatRef} className="flex-grow overflow-y-auto mb-4 space-y-2">
        {chatHistory.map((chat, index) => (
          <Chat key={index} sender={chat.sender} message={chat.message} />
        ))}
      </div>
      <div className="flex dark:bg-[#2F2F2F]">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your message..."
          className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none dark:bg-[#2F2F2F] text-white"
        />
        <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition-colors">
          {userInput.trim() === "" ? "Ask AI" : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatBotWindow;

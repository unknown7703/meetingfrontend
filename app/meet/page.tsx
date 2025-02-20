"use client";
import { useState } from "react";
import AudioControls from "@/components/meet/AudioControls";
import TranscriptDisplay from "@/components/meet/TranscriptDisplay";
import ScreenShare from "@/components/meet/ScreenShare";
import { useAudioTranscriber } from "@/hooks/useAudioTranscriber";
import ChatBotWindow from "@/components/meet/ChatBotWindow";

interface ChatMessage {
  sender: "user" | "bot";
  message: string;
}

export default function Meet() {
  const { isRecording, transcript, status, startRecording, stopRecording, videoRef } = useAudioTranscriber();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL;

  const addMessageToChatHistory = (sender: "user" | "bot", message: string) => {
    setChatHistory((prevChatHistory) => [...prevChatHistory, { sender, message }]);
  };

  const askAI = async () => {
    if (!FASTAPI_URL) {
      alert("FastAPI URL is missing");
      return;
    }

    const last50Words = transcript.split(" ").slice(-50).join(" ");
    if (!last50Words.trim()) return;

    addMessageToChatHistory("user", last50Words);

    try {
      const response = await fetch(`${FASTAPI_URL}/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: last50Words }),
      });
      const data = await response.json();
      const botResponse = data.response || "No response";

      addMessageToChatHistory("bot", botResponse);
    } catch (error) {
      addMessageToChatHistory("bot", "Error fetching response");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="w-2/5 flex flex-col space-y-4 p-6">
        <ScreenShare videoRef={videoRef} />
        <TranscriptDisplay transcript={transcript} receivedText={""} />
      </div>
      <div className="w-3/5 flex flex-col space-y-4 p-6">
        <AudioControls
          transcript={transcript}
          isRecording={isRecording}
          status={status}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />
        <div className="bg-background p-4 rounded-md shadow-md h-full border border-border">
          <h3 className="text-lg font-semibold">AI Chat</h3>
          <ChatBotWindow chatHistory={chatHistory} addMessageToChatHistory={addMessageToChatHistory} askAI={askAI} />
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Props {
  transcript: string;
  isRecording: boolean;
  status: string;
  startRecording: () => void;
  stopRecording: () => void;
}

export default function AudioControls({ transcript, isRecording, status, startRecording, stopRecording }: Props) {
  const router = useRouter();
  const { data: session } = useSession();

  const uploadSummary = async (summary: string) => {
    if (!session?.user?.id) {
      alert("User not authenticated");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", session.user.id);
      formData.append("summary", summary);

      await axios.post(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/uploadsummary`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.push("/summary");
    } catch (error) {
      console.error("Error uploading summary:", error);
      alert("Error uploading the summary");
    }
  };

  const summarizeTranscript = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/summary`, {
        text: transcript,
      });
      const summary = response.data.summary;
      console.log(summary);
      await uploadSummary(summary);
    } catch (error) {
      console.error("Error summarizing:", error);
      alert("Error summarizing the transcript");
    }
  };

  useEffect(() => {
    if (!isRecording && transcript) {
      summarizeTranscript();
    }
  }, [isRecording, transcript]);

  return (
    <div className="bg-background p-4 rounded-md shadow-md border border-border">
      <div className="flex justify-end space-x-2">
        <Button onClick={isRecording ? stopRecording : startRecording} disabled={status.includes("Connecting")}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      </div>
      <div className="mt-4">
        <h3>Status: {status}</h3>
      </div>
    </div>
  );
}

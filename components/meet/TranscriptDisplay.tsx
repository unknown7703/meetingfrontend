"use client";
interface Props {
    transcript: string;
    receivedText: string;
  }
  
  export default function TranscriptDisplay({ transcript }: Props) {
    return (
      <div className="bg-background p-4 rounded-md shadow-md h-[60%] border border-border">
        <h3 className="text-lg font-semibold">Transcription:</h3>
        <p className="text-sm">{transcript}</p>
      </div>
    );
  }
  
"use client";
import { RefObject } from "react";

interface Props {
  videoRef: RefObject<HTMLVideoElement | null>;
}

export default function ScreenShare({ videoRef }: Props) {
  return (
    <div className="bg-background p-4 rounded-md shadow-md h-[40%] border border-border">
      <video ref={videoRef as RefObject<HTMLVideoElement>} autoPlay playsInline muted className="w-full h-full object-cover mt-4 rounded-md" />
    </div>
  );
}

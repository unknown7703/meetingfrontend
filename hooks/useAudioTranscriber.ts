"use client";
import { useState, useRef } from "react";

export function useAudioTranscriber() {
  const API_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("Idle");

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      await initializeWebSocket(audioContext.sampleRate);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const initializeWebSocket = async (sampleRate: number) => {
    if (!API_KEY) {
      setStatus("API key missing");
      return;
    }

    const wsUrl = `wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=${sampleRate}&channels=1`;
    websocketRef.current = new WebSocket(wsUrl, ["token", API_KEY]);

    websocketRef.current.onopen = () => {
      setupAudioProcessing();
    };

    websocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.channel?.alternatives[0]?.transcript) {
        const newTranscript = data.channel.alternatives[0].transcript;
        setTranscript((prev) => prev + " " + newTranscript);
      }
    };

    websocketRef.current.onclose = () => setStatus("Connection closed");
  };

  const setupAudioProcessing = () => {
    if (audioContextRef.current) {
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (event) => {
        if (websocketRef.current?.readyState === WebSocket.OPEN) {
          const audioData = convertFloat32ToInt16(event.inputBuffer.getChannelData(0));
          websocketRef.current.send(audioData);
        }
      };

      if (sourceRef.current) sourceRef.current.connect(processor);
      processor.connect(audioContextRef.current.destination);
      setIsRecording(true);
      setStatus("Recording...");
    }
  };

  const stopRecording = () => {
    websocketRef.current?.close();
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    audioContextRef.current?.close();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
    setStatus("Stopped");
  };

  const convertFloat32ToInt16 = (buffer: Float32Array): ArrayBuffer => {
    const buf = new Int16Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      buf[i] = Math.min(1, buffer[i]) * 0x7fff;
    }
    return buf.buffer;
  };

  return { isRecording, transcript, status, startRecording, stopRecording, videoRef };
}

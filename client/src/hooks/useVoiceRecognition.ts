import { useState, useEffect, useRef } from "react";

type VoiceStatus = "idle" | "listening" | "processing" | "error";

interface UseVoiceRecognitionReturn {
  isListening: boolean;
  transcript: string;
  status: VoiceStatus;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useVoiceRecognition(): UseVoiceRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  useEffect(() => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser");
      setStatus("error");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onstart = () => {
      setStatus("listening");
      setIsListening(true);
      setError(null);
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcriptResult = event.results[0][0].transcript;
      setTranscript(transcriptResult);
      setStatus("processing");
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event: any) => {
      setError(event.error);
      setStatus("error");
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (status === "listening") {
        setStatus("idle");
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSupported]);

  const startListening = () => {
    if (!isSupported || !recognitionRef.current) {
      setError("Speech recognition is not supported");
      setStatus("error");
      return;
    }

    try {
      setTranscript("");
      setError(null);
      recognitionRef.current.start();
    } catch (err) {
      setError("Failed to start voice recognition");
      setStatus("error");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setStatus("idle");
    }
  };

  const resetTranscript = () => {
    setTranscript("");
    setStatus("idle");
    setError(null);
  };

  return {
    isListening,
    transcript,
    status,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState<"ready" | "listening" | "processing">("ready");

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      setStatus("processing");
      
      // Simulate processing
      setTimeout(() => {
        setStatus("ready");
        setTranscript("Voice command received. In the full version, this would use the Web Speech API.");
      }, 1500);
    } else {
      setIsListening(true);
      setStatus("listening");
      setTranscript("");
    }
  };

  const statusText = {
    ready: "Click to start voice command",
    listening: "Listening...",
    processing: "Processing...",
  };

  return (
    <Card className="p-8" data-testid="voice-assistant-container">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Voice Assistant</h3>
          <p className="text-sm text-muted-foreground">
            Try: "Add ₹500 expense for groceries" or "Show my top spending category"
          </p>
        </div>

        <Button
          size="icon"
          variant={isListening ? "destructive" : "default"}
          className={`w-16 h-16 rounded-full ${isListening ? "animate-pulse" : ""}`}
          onClick={toggleListening}
          data-testid="button-voice-toggle"
        >
          {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm font-medium">{statusText[status]}</p>
          {transcript && (
            <div className="mt-4 p-4 bg-muted rounded-lg max-w-md">
              <p className="text-sm">{transcript}</p>
            </div>
          )}
        </div>

        <div className="w-full max-w-md space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Example commands:</p>
          <div className="space-y-1">
            {[
              "Add ₹500 expense for groceries",
              "Show my savings for October",
              "What is my top spending category?",
              "How much did I spend on food this month?",
            ].map((cmd) => (
              <p key={cmd} className="text-xs text-muted-foreground pl-3">• {cmd}</p>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

import VoiceAssistant from "@/components/VoiceAssistant";

export default function VoiceControl() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Voice Assistant</h1>
        <p className="text-muted-foreground mt-1">Control your finances with voice commands</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <VoiceAssistant />
      </div>
    </div>
  );
}

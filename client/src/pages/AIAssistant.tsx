import AIChat from "@/components/AIChat";

export default function AIAssistant() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">AI Financial Assistant</h1>
        <p className="text-muted-foreground mt-1">Get personalized insights and advice about your finances</p>
      </div>

      <div className="max-w-4xl">
        <AIChat />
      </div>
    </div>
  );
}

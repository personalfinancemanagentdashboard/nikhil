import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, TrendingUp, Target, Bell, MessageSquare, Mic } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">SmartFinance.AI</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your AI-powered personal finance companion
          </p>
          <Button
            size="lg"
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-login"
            className="text-lg px-8"
          >
            Get Started
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <Card className="p-6 hover-elevate">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
            <p className="text-muted-foreground">
              Get personalized financial advice powered by advanced AI
            </p>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Spending</h3>
            <p className="text-muted-foreground">
              Monitor your transactions and spending patterns effortlessly
            </p>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Set Goals</h3>
            <p className="text-muted-foreground">
              Create and track savings goals with intelligent progress monitoring
            </p>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Bill Reminders</h3>
            <p className="text-muted-foreground">
              Never miss a payment with smart bill tracking and reminders
            </p>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Chat Assistant</h3>
            <p className="text-muted-foreground">
              Chat with your AI financial advisor anytime for instant help
            </p>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Voice Control</h3>
            <p className="text-muted-foreground">
              Manage your finances hands-free with voice commands
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

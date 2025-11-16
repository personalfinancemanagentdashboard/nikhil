import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertCircle, Lightbulb } from "lucide-react";

interface InsightCardProps {
  type: "positive" | "warning" | "info" | "tip";
  title: string;
  description: string;
}

const insightConfig = {
  positive: {
    icon: TrendingUp,
    bgColor: "bg-green-100 dark:bg-green-950",
    textColor: "text-green-600 dark:text-green-400",
    borderColor: "border-green-200 dark:border-green-900",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-orange-100 dark:bg-orange-950",
    textColor: "text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-200 dark:border-orange-900",
  },
  info: {
    icon: TrendingDown,
    bgColor: "bg-blue-100 dark:bg-blue-950",
    textColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-900",
  },
  tip: {
    icon: Lightbulb,
    bgColor: "bg-purple-100 dark:bg-purple-950",
    textColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-200 dark:border-purple-900",
  },
};

export default function InsightCard({ type, title, description }: InsightCardProps) {
  const config = insightConfig[type];
  const Icon = config.icon;

  return (
    <Card className={`p-4 border-l-4 ${config.borderColor}`} data-testid={`insight-card-${type}`}>
      <div className="flex gap-3">
        <div className={`w-10 h-10 rounded-md ${config.bgColor} ${config.textColor} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}

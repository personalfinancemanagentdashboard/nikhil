import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: React.ReactNode;
  iconColor?: string;
}

export default function StatCard({ title, value, change, icon, iconColor = "bg-primary" }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-md ${iconColor} text-primary-foreground flex items-center justify-center`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            change.type === "increase" ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
          }`}>
            {change.type === "increase" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {Math.abs(change.value)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold font-mono mt-2">{value}</p>
      </div>
    </Card>
  );
}

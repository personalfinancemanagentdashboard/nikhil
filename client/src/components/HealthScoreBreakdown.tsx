import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface ScoreComponentProps {
  label: string;
  score: number;
  maxScore: number;
}

function ScoreComponent({ label, score, maxScore }: ScoreComponentProps) {
  const percentage = (score / maxScore) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-semibold">{score}/{maxScore}</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

interface HealthScoreData {
  totalScore: number;
  rating: string;
  savingsRatio: {
    score: number;
    maxScore: number;
    label: string;
  };
  budgetAdherence: {
    score: number;
    maxScore: number;
    label: string;
  };
  goalProgress: {
    score: number;
    maxScore: number;
    label: string;
  };
  billManagement: {
    score: number;
    maxScore: number;
    label: string;
  };
}

export default function HealthScoreBreakdown() {
  const { data: healthScore, isLoading } = useQuery<HealthScoreData>({
    queryKey: ["/api/health-score"],
  });

  if (isLoading) {
    return (
      <Card className="p-6" data-testid="health-score-breakdown">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Financial Health Score</h3>
            <Skeleton className="h-20 w-32 mx-auto" />
          </div>
          <div className="space-y-4 pt-4 border-t">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </Card>
    );
  }

  if (!healthScore) {
    return (
      <Card className="p-6" data-testid="health-score-breakdown">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Financial Health Score</h3>
          <p className="text-muted-foreground">Unable to load health score</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6" data-testid="health-score-breakdown">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Financial Health Score</h3>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-bold font-mono" data-testid="text-health-score">
              {healthScore.totalScore}
            </span>
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2" data-testid="text-health-rating">
            {healthScore.rating}
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <ScoreComponent 
            label={healthScore.savingsRatio.label}
            score={healthScore.savingsRatio.score}
            maxScore={healthScore.savingsRatio.maxScore}
          />
          <ScoreComponent 
            label={healthScore.budgetAdherence.label}
            score={healthScore.budgetAdherence.score}
            maxScore={healthScore.budgetAdherence.maxScore}
          />
          <ScoreComponent 
            label={healthScore.goalProgress.label}
            score={healthScore.goalProgress.score}
            maxScore={healthScore.goalProgress.maxScore}
          />
          <ScoreComponent 
            label={healthScore.billManagement.label}
            score={healthScore.billManagement.score}
            maxScore={healthScore.billManagement.maxScore}
          />
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Your financial health is calculated based on your savings rate, budget compliance, goal progress, and bill payments.
          </p>
        </div>
      </div>
    </Card>
  );
}

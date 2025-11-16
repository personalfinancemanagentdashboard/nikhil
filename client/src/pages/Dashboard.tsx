import StatCard from "@/components/StatCard";
import SpendingChart from "@/components/SpendingChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import TransactionRow from "@/components/TransactionRow";
import InsightCard from "@/components/InsightCard";
import HealthScoreBreakdown from "@/components/HealthScoreBreakdown";
import { Card } from "@/components/ui/card";
import { Wallet, TrendingUp, PiggyBank, Activity, Receipt } from "lucide-react";
import AddTransactionDialog from "@/components/AddTransactionDialog";
import { useQuery } from "@tanstack/react-query";
import type { Transaction } from "@shared/schema";

interface HealthScoreData {
  totalScore: number;
  rating: string;
}

export default function Dashboard() {
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: healthScoreData } = useQuery<HealthScoreData>({
    queryKey: ["/api/health-score"],
  });

  // Calculate financial summary
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const savings = totalIncome - totalExpenses;

  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Use real health score from API
  const healthScore = healthScoreData?.totalScore ?? 0;
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your financial overview</p>
        </div>
        <AddTransactionDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={`₹${totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          icon={<TrendingUp className="w-5 h-5" />}
          iconColor="bg-green-600"
        />
        <StatCard
          title="Total Expenses"
          value={`₹${totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          icon={<Wallet className="w-5 h-5" />}
          iconColor="bg-blue-600"
        />
        <StatCard
          title="Savings"
          value={`₹${savings.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          icon={<PiggyBank className="w-5 h-5" />}
          iconColor="bg-purple-600"
        />
        <StatCard
          title="Financial Health"
          value={`${healthScore}/100`}
          icon={<Activity className="w-5 h-5" />}
          iconColor="bg-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingChart />
            <CategoryPieChart />
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Recent Transactions</h2>
              <a href="/transactions" className="text-sm text-primary hover:underline" data-testid="link-view-all">
                View all
              </a>
            </div>
            <div>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading transactions...
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <Receipt className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-4">No transactions yet</p>
                  <AddTransactionDialog />
                </div>
              ) : (
                recentTransactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    id={transaction.id}
                    title={transaction.title}
                    category={transaction.category as any}
                    amount={parseFloat(transaction.amount)}
                    date={new Date(transaction.date)}
                    type={transaction.type as "income" | "expense"}
                  />
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <HealthScoreBreakdown />
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">AI Insights</h2>
            {transactions.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">
                  Add transactions to get personalized AI insights
                </p>
              </Card>
            ) : (
              <>
                {savings > 0 && (
                  <InsightCard
                    type="positive"
                    title="Great job!"
                    description={`You've saved ₹${savings.toLocaleString('en-IN')} so far.`}
                  />
                )}
                {savingsRate < 20 && totalIncome > 0 && (
                  <InsightCard
                    type="warning"
                    title="Savings Alert"
                    description="Try to save at least 20% of your income for financial security."
                  />
                )}
                <InsightCard
                  type="tip"
                  title="Track Regularly"
                  description="Add transactions daily to get accurate insights and better financial control."
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

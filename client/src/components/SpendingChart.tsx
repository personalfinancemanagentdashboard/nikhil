import { Card } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import type { Transaction } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function SpendingChart() {
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = transaction.date.substring(0, 7);
    
    if (!acc[month]) {
      acc[month] = { month, income: 0, expenses: 0 };
    }
    
    const amount = parseFloat(transaction.amount);
    if (transaction.type === "income") {
      acc[month].income += amount;
    } else {
      acc[month].expenses += amount;
    }
    
    return acc;
  }, {} as Record<string, { month: string; income: number; expenses: number }>);

  const sortedData = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6)
    .map(item => ({
      month: new Date(item.month + "-01").toLocaleDateString('en-US', { month: 'short' }),
      income: item.income,
      expenses: item.expenses,
    }));

  if (isLoading) {
    return (
      <Card className="p-6" data-testid="spending-chart">
        <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
        <Skeleton className="h-[300px] w-full" />
      </Card>
    );
  }

  if (sortedData.length === 0) {
    return (
      <Card className="p-6" data-testid="spending-chart">
        <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No transaction data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6" data-testid="spending-chart">
      <h3 className="text-lg font-semibold mb-4">Income vs Expenses (Last 6 Months)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="month" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
          />
          <Legend />
          <Bar dataKey="income" fill="hsl(var(--chart-1))" name="Income" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" fill="hsl(var(--chart-2))" name="Expenses" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

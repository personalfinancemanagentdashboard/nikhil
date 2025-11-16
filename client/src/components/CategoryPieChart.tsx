import { Card } from "@/components/ui/card";
import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import type { Transaction } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function CategoryPieChart() {
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const categoryData = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += parseFloat(transaction.amount);
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(categoryData)
    .map(([name, value], index) => ({
      name,
      value,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }))
    .sort((a, b) => b.value - a.value);

  if (isLoading) {
    return (
      <Card className="p-6" data-testid="category-pie-chart">
        <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
        <Skeleton className="h-[300px] w-full" />
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="p-6" data-testid="category-pie-chart">
        <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No expense data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6" data-testid="category-pie-chart">
      <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

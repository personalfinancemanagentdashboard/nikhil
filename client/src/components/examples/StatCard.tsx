import StatCard from '../StatCard';
import { Wallet, TrendingUp, PiggyBank, Activity } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <StatCard
        title="Total Income"
        value="₹85,420"
        change={{ value: 12.5, type: "increase" }}
        icon={<TrendingUp className="w-5 h-5" />}
        iconColor="bg-green-600"
      />
      <StatCard
        title="Total Expenses"
        value="₹52,340"
        change={{ value: 8.2, type: "increase" }}
        icon={<Wallet className="w-5 h-5" />}
        iconColor="bg-blue-600"
      />
      <StatCard
        title="Savings"
        value="₹33,080"
        change={{ value: 15.3, type: "increase" }}
        icon={<PiggyBank className="w-5 h-5" />}
        iconColor="bg-purple-600"
      />
      <StatCard
        title="Financial Health"
        value="82/100"
        change={{ value: 5, type: "increase" }}
        icon={<Activity className="w-5 h-5" />}
        iconColor="bg-primary"
      />
    </div>
  );
}

import InsightCard from '../InsightCard';

export default function InsightCardExample() {
  return (
    <div className="grid grid-cols-1 gap-4 p-6">
      <InsightCard
        type="positive"
        title="Great Savings This Month!"
        description="You saved ₹5,000 more than your 3-month average. Keep up the good work!"
      />
      <InsightCard
        type="warning"
        title="Food Budget Alert"
        description="Your food expenses increased by 20% this month. Consider meal planning to reduce costs."
      />
      <InsightCard
        type="info"
        title="Transport Spending Down"
        description="Your transport costs decreased by 15% compared to last month."
      />
      <InsightCard
        type="tip"
        title="Smart Saving Tip"
        description="Set up automatic transfers to your savings account on payday to build your emergency fund faster."
      />
    </div>
  );
}

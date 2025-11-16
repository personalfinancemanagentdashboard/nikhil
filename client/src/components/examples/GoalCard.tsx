import GoalCard from '../GoalCard';

export default function GoalCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <GoalCard
        title="New Laptop"
        current={45000}
        target={80000}
        deadline="March 2026"
      />
      <GoalCard
        title="Emergency Fund"
        current={125000}
        target={200000}
        deadline="December 2026"
      />
      <GoalCard
        title="Vacation to Goa"
        current={18000}
        target={50000}
        deadline="June 2026"
      />
    </div>
  );
}

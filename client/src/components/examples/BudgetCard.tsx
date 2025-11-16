import BudgetCard from '../BudgetCard';

export default function BudgetCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      <BudgetCard category="Food" spent={8500} total={10000} />
      <BudgetCard category="Transport" spent={2400} total={5000} />
      <BudgetCard category="Bills" spent={4200} total={5000} />
      <BudgetCard category="Entertainment" spent={1800} total={3000} />
      <BudgetCard category="Rent" spent={15000} total={15000} />
    </div>
  );
}

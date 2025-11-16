import BillCard from '../BillCard';

export default function BillCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      <BillCard
        name="Electricity Bill"
        amount={1850}
        dueDate={new Date(2025, 10, 15)}
        category="Utilities"
      />
      <BillCard
        name="Internet"
        amount={999}
        dueDate={new Date(2025, 10, 13)}
        category="Utilities"
      />
      <BillCard
        name="Credit Card"
        amount={12500}
        dueDate={new Date(2025, 10, 20)}
        category="Credit"
      />
    </div>
  );
}

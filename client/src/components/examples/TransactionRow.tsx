import TransactionRow from '../TransactionRow';

export default function TransactionRowExample() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <div>
        <TransactionRow
          id="1"
          title="Grocery Shopping"
          category="Food"
          amount={2450}
          date={new Date(2025, 10, 10)}
          type="expense"
        />
        <TransactionRow
          id="2"
          title="Monthly Salary"
          category="Other"
          amount={85000}
          date={new Date(2025, 10, 1)}
          type="income"
        />
        <TransactionRow
          id="3"
          title="Electricity Bill"
          category="Bills"
          amount={1800}
          date={new Date(2025, 10, 8)}
          type="expense"
        />
        <TransactionRow
          id="4"
          title="Uber Ride"
          category="Transport"
          amount={320}
          date={new Date(2025, 10, 9)}
          type="expense"
        />
      </div>
    </div>
  );
}

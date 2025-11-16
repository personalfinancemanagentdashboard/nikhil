import { Card } from "@/components/ui/card";
import TransactionRow from "@/components/TransactionRow";
import AddTransactionDialog from "@/components/AddTransactionDialog";
import { Input } from "@/components/ui/input";
import { Search, Receipt } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Transaction, Category } from "@shared/schema";
import { useState } from "react";

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const filteredTransactions = transactions.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Transactions</h1>
          <p className="text-muted-foreground mt-1">Manage all your income and expenses</p>
        </div>
        <AddTransactionDialog />
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-10"
            data-testid="input-search-transactions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">All Transactions</h2>
        <div>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading transactions...
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "No transactions match your search"
                  : "Start by adding your first transaction"}
              </p>
              {!searchQuery && <AddTransactionDialog />}
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                id={transaction.id}
                title={transaction.title}
                category={transaction.category as Category}
                amount={parseFloat(transaction.amount)}
                date={new Date(transaction.date)}
                type={transaction.type as "income" | "expense"}
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

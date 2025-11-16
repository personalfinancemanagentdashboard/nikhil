import { useState, useMemo } from "react";
import BudgetCard from "@/components/BudgetCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Receipt } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Budget, type Transaction } from "@shared/schema";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const budgetFormSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Must be a positive number"),
  month: z.string().min(1, "Month is required"),
});

type BudgetFormData = z.infer<typeof budgetFormSchema>;

export default function Budgets() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const currentMonth = new Date().toISOString().slice(0, 7);

  const { data: budgets = [], isLoading: budgetsLoading } = useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const budgetWithSpending = useMemo(() => {
    return budgets.map((budget) => {
      const spent = transactions
        .filter((t) => 
          t.type === "expense" && 
          t.category === budget.category &&
          t.date.startsWith(budget.month)
        )
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      return {
        ...budget,
        spent,
      };
    });
  }, [budgets, transactions]);

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: "",
      amount: "",
      month: currentMonth,
    },
  });

  const createBudgetMutation = useMutation({
    mutationFn: async (data: BudgetFormData) => {
      return await apiRequest("POST", "/api/budgets", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      setIsAddDialogOpen(false);
      form.reset({
        category: "",
        amount: "",
        month: currentMonth,
      });
      toast({
        title: "Success",
        description: "Budget added successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add budget. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BudgetFormData) => {
    createBudgetMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Budgets</h1>
          <p className="text-muted-foreground mt-1">Track your spending against monthly budgets</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          data-testid="button-add-budget"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {budgetsLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading budgets...</div>
      ) : budgetWithSpending.length === 0 ? (
        <div className="text-center py-12">
          <Receipt className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No budgets yet</h3>
          <p className="text-muted-foreground mb-4">
            Start by creating your first budget to track your spending
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Budget
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgetWithSpending.map((budget) => (
            <BudgetCard
              key={budget.id}
              id={budget.id}
              category={budget.category as any}
              spent={budget.spent}
              total={parseFloat(budget.amount)}
              month={budget.month}
            />
          ))}
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent data-testid="dialog-add-budget">
          <DialogHeader>
            <DialogTitle>Add New Budget</DialogTitle>
            <DialogDescription>
              Create a new monthly budget to track your spending
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-budget-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Rent">Rent</SelectItem>
                        <SelectItem value="Bills">Bills</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Amount (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g., 10000" 
                        {...field}
                        data-testid="input-budget-amount"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <FormControl>
                      <Input 
                        type="month" 
                        {...field}
                        data-testid="input-budget-month"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    form.reset();
                  }}
                  data-testid="button-cancel-budget"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createBudgetMutation.isPending}
                  data-testid="button-save-budget"
                >
                  {createBudgetMutation.isPending ? "Adding..." : "Add Budget"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

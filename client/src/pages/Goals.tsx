import { useState } from "react";
import GoalCard from "@/components/GoalCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Eye, EyeOff } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Goal } from "@shared/schema";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const goalFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  targetAmount: z.string().min(1, "Target amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Must be a positive number"),
  currentAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Must be a non-negative number"),
  deadline: z.string().optional(),
});

type GoalFormData = z.infer<typeof goalFormSchema>;

export default function Goals() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const { toast } = useToast();

  const { data: goals = [], isLoading, error } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: "",
      targetAmount: "",
      currentAmount: "0",
      deadline: "",
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: async (data: GoalFormData) => {
      const payload = {
        title: data.title,
        targetAmount: String(data.targetAmount),
        currentAmount: String(data.currentAmount),
        deadline: data.deadline || null,
      };
      return await apiRequest("POST", "/api/goals", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Goal added successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add goal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GoalFormData) => {
    createGoalMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold">Savings Goals</h1>
          <p className="text-muted-foreground mt-1">Track progress towards your financial goals</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            data-testid="button-add-goal"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            data-testid="button-toggle-preview"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show
              </>
            )}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="text-center py-12 text-destructive">
          Error loading goals. Please try refreshing the page.
        </div>
      ) : isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading goals...</div>
      ) : !showPreview ? (
        <div className="text-center py-12 text-muted-foreground">
          Goals are hidden. Click "Show" to view your goals.
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No goals yet. Click "Add Goal" to create your first savings goal!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              id={goal.id}
              title={goal.title}
              current={parseFloat(goal.currentAmount)}
              target={parseFloat(goal.targetAmount)}
              deadline={goal.deadline || undefined}
            />
          ))}
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent data-testid="dialog-add-goal">
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
            <DialogDescription>
              Create a new savings goal to track your progress
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., New Laptop, Vacation" 
                        {...field} 
                        data-testid="input-goal-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Amount (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g., 80000" 
                        {...field}
                        data-testid="input-goal-target"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Amount (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g., 0" 
                        {...field}
                        data-testid="input-goal-current"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        data-testid="input-goal-deadline"
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
                  data-testid="button-cancel-goal"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createGoalMutation.isPending}
                  data-testid="button-save-goal"
                >
                  {createGoalMutation.isPending ? "Adding..." : "Add Goal"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

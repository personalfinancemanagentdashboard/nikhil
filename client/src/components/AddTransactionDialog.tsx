import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Mic, MicOff, Camera, Keyboard } from "lucide-react";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { parseVoiceCommand } from "@/lib/voiceParser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ReceiptScanner from "@/components/ReceiptScanner";

export default function AddTransactionDialog() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"manual" | "ocr">("manual");
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
  });
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState("");

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {
    isListening,
    transcript,
    status,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition();

  const createTransactionMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/transactions", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
      setOpen(false);
      setFormData({
        title: "",
        amount: "",
        category: "",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
      });
      setLastProcessedTranscript("");
      resetTranscript();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
      setLastProcessedTranscript("");
      resetTranscript();
    },
  });

  useEffect(() => {
    if (
      transcript &&
      status === "processing" &&
      transcript !== lastProcessedTranscript &&
      !createTransactionMutation.isPending
    ) {
      setLastProcessedTranscript(transcript);
      const parsed = parseVoiceCommand(transcript);
      if (parsed) {
        createTransactionMutation.mutate(parsed);
        toast({
          title: "Voice command recognized",
          description: `Adding ${parsed.type}: ₹${parsed.amount} for ${parsed.title}`,
        });
      } else {
        toast({
          title: "Could not parse command",
          description: "Please try again or enter manually.",
          variant: "destructive",
        });
        setLastProcessedTranscript("");
        resetTranscript();
      }
    }
  }, [transcript, status, lastProcessedTranscript, createTransactionMutation.isPending, toast, resetTranscript, createTransactionMutation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTransactionMutation.mutate(formData);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleOCRExtracted = (data: any) => {
    setFormData({
      title: data.title,
      amount: data.amount,
      category: data.category,
      type: data.type,
      date: data.date,
    });
    setActiveTab("manual");
    toast({
      title: "Transaction data extracted",
      description: "Review and submit the transaction details below",
    });
  };

  const handleCancelOCR = () => {
    setActiveTab("manual");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-transaction">
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Record a new income or expense transaction
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "manual" | "ocr")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" data-testid="tab-manual-entry">
              <Keyboard className="w-4 h-4 mr-2" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="ocr" data-testid="tab-ocr-scan">
              <Camera className="w-4 h-4 mr-2" />
              Scan Receipt
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ocr" className="mt-4">
            <ReceiptScanner onExtracted={handleOCRExtracted} onCancel={handleCancelOCR} />
          </TabsContent>

          <TabsContent value="manual" className="mt-4">
            {isSupported && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {status === "idle" && "Click mic to use voice input"}
                    {status === "listening" && "Listening... Speak now"}
                    {status === "processing" && "Processing your command..."}
                    {status === "error" && error}
                  </p>
                  <Button
                    type="button"
                    size="icon"
                    variant={isListening ? "destructive" : "outline"}
                    onClick={handleVoiceToggle}
                    data-testid="button-voice-input"
                    disabled={status === "processing"}
                    className={isListening ? "animate-pulse" : ""}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                </div>
                {transcript && (
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground">Recognized:</p>
                    <p className="text-sm" data-testid="text-voice-transcript">{transcript}</p>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Description</Label>
                <Input
                  id="title"
                  placeholder="e.g., Grocery shopping"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  data-testid="input-transaction-title"
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  data-testid="input-transaction-amount"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger data-testid="select-transaction-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Rent">Rent</SelectItem>
                    <SelectItem value="Bills">Bills</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger data-testid="select-transaction-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  data-testid="input-transaction-date"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                data-testid="button-submit-transaction"
                disabled={createTransactionMutation.isPending}
              >
                {createTransactionMutation.isPending ? "Adding..." : "Add Transaction"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Loader2, Camera } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface OCRResult {
  title: string;
  amount: string;
  category: string;
  date: string;
  type: "income" | "expense";
}

interface ReceiptScannerProps {
  onExtracted: (data: OCRResult) => void;
  onCancel: () => void;
}

export default function ReceiptScanner({ onExtracted, onCancel }: ReceiptScannerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const extractMutation = useMutation({
    mutationFn: async (imageBase64: string) => {
      const res = await apiRequest("POST", "/api/transactions/ocr", { image: imageBase64 });
      return await res.json() as OCRResult;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Transaction details extracted successfully",
      });
      onExtracted(data);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to extract transaction details from image",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleScan = () => {
    if (!selectedImage) return;
    extractMutation.mutate(selectedImage);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Scan Receipt/Bill</h3>
        <p className="text-sm text-muted-foreground">
          Upload a photo of your receipt or bill to automatically extract transaction details
        </p>
      </div>

      <div className="space-y-4">
        {!selectedImage ? (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Camera className="w-8 h-8" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Upload receipt or bill image</p>
              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG, JPEG (max 10MB)
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={extractMutation.isPending}
                data-testid="button-select-image"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={extractMutation.isPending}
                data-testid="button-cancel-ocr"
              >
                Cancel
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img
                src={selectedImage}
                alt="Receipt preview"
                className="w-full max-h-96 object-contain bg-muted"
                data-testid="img-receipt-preview"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={handleClear}
                disabled={extractMutation.isPending}
                data-testid="button-clear-image"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {imageFile && (
              <div className="text-sm text-muted-foreground">
                <p>File: {imageFile.name}</p>
                <p>Size: {(imageFile.size / 1024).toFixed(2)} KB</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleScan}
                disabled={extractMutation.isPending}
                className="flex-1"
                data-testid="button-scan-receipt"
              >
                {extractMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Scan Receipt
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={extractMutation.isPending}
                data-testid="button-choose-different"
              >
                Choose Different
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

import { useState } from "react";
import { PlusIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useMutateAddAccessory } from "@/hooks/useMutateAddAccessory";

type AddAccessoryDialogProps = {
  disabled?: boolean;
};

export function AddAccessoryDialog({ disabled = false }: AddAccessoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const { mutate: addAccessory, isPending: isAdding } = useMutateAddAccessory();

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    // Validate URL and set preview
    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  const handleSubmit = () => {
    if (!name.trim() || !imageUrl.trim()) {
      return;
    }

    addAccessory(
      { name: name.trim(), imageUrl: imageUrl.trim() },
      {
        onSuccess: () => {
          setName("");
          setImageUrl("");
          setPreviewUrl("");
          setIsOpen(false);
        },
      }
    );
  };

  const isValidForm = name.trim() && imageUrl.trim() && previewUrl;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          className="w-full cursor-pointer bg-transparent text-white border border-primary hover:bg-primary/10"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Custom Accessory
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Create Custom Accessory
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="accessory-name" className="text-sm font-medium">
              Accessory Name
            </label>
            <Input
              id="accessory-name"
              placeholder="e.g., Cool Hat, Magic Ring..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isAdding}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="accessory-image" className="text-sm font-medium">
              Image URL
            </label>
            <Input
              id="accessory-image"
              placeholder="https://example.com/image.png"
              value={imageUrl}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              disabled={isAdding}
            />
          </div>

          {previewUrl && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Preview</label>
              <Card className="p-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{name || "Accessory Name"}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <img
                    src={previewUrl}
                    alt="Accessory preview"
                    className="w-16 h-16 rounded-md border object-cover"
                    onError={() => setPreviewUrl("")}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isAdding}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValidForm || isAdding}
              className="flex-1"
            >
              {isAdding ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlusIcon className="mr-2 h-4 w-4" />
              )}
              Create Accessory
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

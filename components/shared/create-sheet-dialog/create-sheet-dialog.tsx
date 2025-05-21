"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  Button,
  Input,
} from "@/components/ui";

import { Loader2, PlusCircle } from "lucide-react";

export const CreateSheetDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("My Offer Tracker");
  const [isCreating, setIsCreating] = useState(false);
  const { update } = useSession();

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title for your sheet");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title }),
      });

      if (!response.ok) throw new Error("Failed to create sheet");

      await update();
      toast.success("Sheet created successfully!");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create sheet");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Your Offer Tracker
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Your Offer Tracker</DialogTitle>
          <DialogDescription>
            This will create a new Google Sheet to track your job applications.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sheet title"
          />
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Sheet"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const STATUS_OPTIONS = [
  "Applied",
  "Interview Scheduled",
  "Technical Test",
  "Offer Received",
  "Rejected",
] as const;

type FormData = {
  company: string;
  position: string;
  link: string;
  status: (typeof STATUS_OPTIONS)[number];
  comments: string;
  contactPerson: string;
  contactInfo: string;
  nextStep: string;
  reminder: string;
};

const INITIAL_FORM_DATA: FormData = {
  company: "",
  position: "",
  link: "",
  status: "Applied",
  comments: "",
  contactPerson: "",
  contactInfo: "",
  nextStep: "",
  reminder: "",
};

const AddOfferForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!session?.user?.sheet?.sheetId) {
        throw new Error("No sheet available");
      }

      const response = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offer: formData }),
      });

      if (!response.ok) throw new Error("Failed to add offer");

      toast.success("Offer added successfully!");
      setFormData(INITIAL_FORM_DATA);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to add offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">Job Posting URL</Label>
        <Input
          id="link"
          name="link"
          type="url"
          value={formData.link}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                status: value as FormData["status"],
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="nextStep">Next Step</Label>
          <Input
            id="nextStep"
            name="nextStep"
            value={formData.nextStep}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input
            id="contactPerson"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactInfo">Contact Email/Phone</Label>
          <Input
            id="contactInfo"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Comments</Label>
        <Input
          id="comments"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reminder">Reminder</Label>
        <Input
          id="reminder"
          name="reminder"
          type="date"
          value={formData.reminder}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          "Add Offer"
        )}
      </Button>
    </form>
  );
};

export default AddOfferForm;

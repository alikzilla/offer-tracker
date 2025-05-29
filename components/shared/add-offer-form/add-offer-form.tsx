"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Offer } from "@/core/lib/offer";
import { STATUS_META } from "@/core/lib/offer";
import {
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";

type EntryForm = Omit<Offer, "id"> & {
  link: string;
  notes: string;
};

type Props = {
  onSuccess: () => void;
};

export default function AddOfferForm({ onSuccess }: Props) {
  const [form, setForm] = useState<EntryForm>({
    company: "",
    vacancy: "",
    status: "response",
    appliedAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString(),
    link: "",
    contacts: "",
    notes: "",
  });
  const [isLoading, setLoading] = useState(false);

  const handleChange = <K extends keyof EntryForm>(
    key: K,
    value: EntryForm[K]
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Не удалось добавить");
      toast.success("Добавлено");
      onSuccess();
      setForm((f) => ({
        ...f,
        company: "",
        vacancy: "",
        link: "",
        notes: "",
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ошибка";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1">
          <Label htmlFor="company">Компания</Label>
          <Input
            id="company"
            value={form.company}
            onChange={(e) => handleChange("company", e.target.value)}
            placeholder="Название компании"
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="vacancy">Вакансия</Label>
          <Input
            id="vacancy"
            value={form.vacancy}
            onChange={(e) => handleChange("vacancy", e.target.value)}
            placeholder="Должность"
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="status">Статус</Label>
          <Select
            value={form.status}
            onValueChange={(val) =>
              handleChange("status", val as EntryForm["status"])
            }
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Выберите статус" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_META).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="appliedAt">Дата отклика</Label>
          <Input
            id="appliedAt"
            type="date"
            value={form.appliedAt}
            onChange={(e) => handleChange("appliedAt", e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="link">Ссылка на вакансию</Label>
          <Input
            id="link"
            type="url"
            value={form.link}
            onChange={(e) => handleChange("link", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="contacts">Контакты</Label>
          <Input
            id="contacts"
            type="text"
            value={form.contacts}
            onChange={(e) => handleChange("contacts", e.target.value)}
            placeholder="Контакты"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Дополнительные заметки"
            rows={3}
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? "Добавляем..." : "Добавить отклик"}
      </Button>
    </form>
  );
}

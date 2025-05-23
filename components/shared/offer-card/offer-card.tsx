"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Offer } from "@/core/lib/offer";
import { STATUS_META } from "@/core/lib/offer";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Badge,
  Label,
} from "@/components/ui";
import { Edit2, Save, X } from "lucide-react";

type Props = {
  offer: Offer;
  onUpdate: () => void;
};

const REVERSE_STATUS_META: Record<
  string,
  { key: keyof typeof STATUS_META; label: string; color: string }
> = {};
Object.entries(STATUS_META).forEach(([key, { label, color }]) => {
  REVERSE_STATUS_META[label] = {
    key: key as keyof typeof STATUS_META,
    label,
    color,
  };
});

export default function OfferCard({ offer, onUpdate }: Props) {
  const [form, setForm] = useState<Omit<Offer, "id">>(offer);
  const [isSaving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/entries/${offer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Ошибка при сохранении");
      toast.success("Сохранено");
      onUpdate();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setSaving(false);
    }
  };

  const meta = REVERSE_STATUS_META[offer.status] ?? {
    key: "response",
    label: offer.status,
    color: "",
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-start">
        <CardTitle>{offer.company}</CardTitle>
        <Badge className={`${meta.color} capitalize`}>{meta.label}</Badge>
      </CardHeader>

      <CardContent className="space-y-2 relative">
        <p className="text-sm font-medium">{offer.vacancy}</p>
        <p className="text-xs text-muted-foreground">
          Отклик: {offer.appliedAt}
        </p>
        {offer.link && (
          <a
            href={offer.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            Перейти к вакансии
          </a>
        )}
        {offer.notes && (
          <p className="text-sm whitespace-pre-wrap">{offer.notes}</p>
        )}

        <Dialog>
          <DialogTrigger asChild className="absolute bottom-0 right-6">
            <Button variant="ghost" size="icon">
              <Edit2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать отклик</DialogTitle>
              <DialogDescription>
                Внесите изменения и нажмите «Сохранить».
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label className="block text-sm font-medium">Компания</Label>
                <Input
                  value={form.company}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, company: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="block text-sm font-medium">Вакансия</Label>
                <Input
                  value={form.vacancy}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, position: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="block text-sm font-medium">Статус</Label>
                <Select
                  value={form.status}
                  onValueChange={(val) =>
                    setForm((f) => ({ ...f, status: val as Offer["status"] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Статус" />
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
                <Label className="block text-sm font-medium">
                  Дата отклика
                </Label>
                <Input
                  type="date"
                  value={form.appliedAt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, appliedAt: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="block text-sm font-medium">
                  Ссылка на вакансию
                </Label>
                <Input
                  type="url"
                  value={form.link || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, link: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="block text-sm font-medium">Notes</Label>
                <Textarea
                  rows={3}
                  value={form.notes || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                />
              </div>
            </div>
            <DialogFooter className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {}} disabled={isSaving}>
                <X className="mr-2 h-4 w-4" /> Отмена
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Сохраняем..." : "Сохранить"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Sheet, SheetContent, Badge } from "@/components/ui";
import { Offer, STATUS_META } from "@/core/lib/offer";

const OfferCard = ({ offer }: { offer: Offer }) => {
  const meta = STATUS_META[offer.status];
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="rounded-2xl shadow bg-card p-4 flex flex-col gap-1 active:scale-[.98] transition-transform"
        onClick={() => setOpen(true)}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm leading-tight truncate pr-4">
            {offer.company}
          </h3>
          <Badge
            className={`${meta.color} text-[10px] font-medium py-0.5 px-1.5`}
          >
            {meta.label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {offer.position}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {new Date(offer.appliedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Drawer деталей */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-[88vh] p-6 space-y-4">
          <h2 className="text-lg font-semibold">{offer.company}</h2>
          <p className="text-sm text-muted-foreground">{offer.position}</p>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default OfferCard;

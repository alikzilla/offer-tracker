"use client";

import { useState } from "react";
import { OfferCard } from "../";
import { Offer } from "@/core/lib/offer";

const Dashboard = ({
  offers,
  mutate,
}: {
  offers: Offer[];
  mutate: () => void;
}) => {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all" ? offers : offers.filter((o) => o.status === filter);

  return (
    <div className="pt-[90px] flex flex-col pt-14">
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground pt-10">
          Пока нет откликов
        </p>
      ) : (
        <div className="space-y-3 px-4">
          {filtered.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onUpdate={() => mutate()} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

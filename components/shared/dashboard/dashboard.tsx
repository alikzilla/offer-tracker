"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { CreateSheetDialog } from "../";
import { Offer } from "@/core/lib/offer";
import useSWR from "swr";
import OfferCard from "../offer-card/offer-card";

const Dashboard = () => {
  const { data: session } = useSession();
  const [filter, setFilter] = useState<string>("all");
  const { data: offers } = useSWR<Offer[]>("/api/entries");

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <p className="text-lg font-medium">Войдите, чтобы начать</p>
      </div>
    );
  }

  if (!session.user.sheet) {
    console.log(session);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-4">
        <p className="text-center text-lg">У вас ещё нет таблицы для трекера</p>
        <CreateSheetDialog />
      </div>
    );
  }

  const filtered =
    filter === "all"
      ? offers ?? []
      : ((offers ?? []).filter((o) => o.status === filter) as Offer[]);

  return (
    <div className="flex flex-col min-h-screen pt-14">
      <div className="p-4 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground pt-10">
            Пока нет откликов
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

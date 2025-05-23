"use client";

import useSWR from "swr";
import {
  BottomBar,
  CreateSheetDialog,
  Dashboard,
  Header,
} from "@/components/shared/";
import { fetcher } from "@/core/lib/fetcher";
import { Offer } from "@/core/lib/offer";
import { useSession } from "next-auth/react";

export default function App() {
  const { data: session } = useSession();
  const {
    data: offers,
    error,
    isLoading,
    mutate,
  } = useSWR<Offer[]>("/api/entries", fetcher);

  return (
    <section className="h-screen flex flex-col bg-background">
      <Header />

      {!session ? (
        <div className="pt-[100px] flex items-center justify-center p-4 text-center">
          <p className="text-lg font-medium">Войдите, чтобы начать</p>
        </div>
      ) : !session.user.sheet ? (
        <div className="pt-[100px] flex flex-col items-center justify-center p-4 space-y-4">
          <p className="text-center text-lg">
            У вас ещё нет таблицы для трекера
          </p>
          <CreateSheetDialog />
        </div>
      ) : error ? (
        <p className="pt-[100px] p-4 text-red-500">Ошибка: {error.message}</p>
      ) : isLoading ? (
        <p className="pt-[100px] p-4 text-center">Загрузка...</p>
      ) : !offers ? (
        <p className="pt-[100px] p-4 text-center">Нет откликов...</p>
      ) : (
        <Dashboard offers={offers} mutate={mutate} />
      )}

      <BottomBar
        onSuccess={() => {
          mutate();
        }}
      />
    </section>
  );
}

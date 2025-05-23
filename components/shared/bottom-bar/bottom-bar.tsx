"use client";

import { Home, Link2 } from "lucide-react";
import AddOfferDrawer from "../add-offer-drawer/add-offer-drawer";
import Link from "next/link";
import { useSession } from "next-auth/react";

const BottomBar = () => {
  const { data: session } = useSession();

  return (
    <nav className="md:hidden sticky bottom-0 bg-background border-t flex justify-around py-2">
      <Link href="/" className="flex flex-col items-center text-xs">
        <Home size={20} /> Трекер
      </Link>
      <AddOfferDrawer />
      <Link
        href={`https://docs.google.com/spreadsheets/d/${session?.user.sheet?.sheetId}`}
        target="_blank"
        className="flex flex-col items-center text-xs"
      >
        <Link2 size={20} /> Таблица
      </Link>
    </nav>
  );
};

export default BottomBar;

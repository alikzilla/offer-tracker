"use client";

import { Header, MainContent } from "@/components/shared";
import { Toaster } from "sonner";

export default function App() {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />

      <MainContent />

      <Toaster />
    </section>
  );
}

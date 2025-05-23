import AuthProvider from "@/components/providers/auth-provider";
import { Header, BottomBar } from "@/components/shared";
import "./globals.css";
import React from "react";

export const metadata = {
  title: "Offer Tracker",
  description: "Мобильный трекер вакансий",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col bg-background">
        <AuthProvider>
          <Header />

          <main className="flex-1">{children}</main>

          <BottomBar />
        </AuthProvider>
      </body>
    </html>
  );
}

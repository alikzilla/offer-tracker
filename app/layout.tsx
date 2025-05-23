import React from "react";
import AuthProvider from "@/components/providers/auth-provider";
import { Header, BottomBar } from "@/components/shared";
import "./globals.css";

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
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

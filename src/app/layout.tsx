import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "BetCyclingFriends",
  description: "Parier entre amis sur les courses WorldTour",
    icons: "/bcf_logo.svg"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

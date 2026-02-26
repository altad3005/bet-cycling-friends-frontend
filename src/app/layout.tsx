import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import Footer from "@/components/layout/Footer";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { AuthProvider } from "@/contexts/AuthContext";

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
        <AuthProvider>
          <GlobalHeader />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

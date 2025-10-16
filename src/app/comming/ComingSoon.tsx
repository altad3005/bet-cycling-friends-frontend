"use client";

import React from "react";
import Image from "next/image";
import { Zap, Trophy } from "lucide-react";

export default function ComingSoon() {
    return (
        <div className="min-h-screen flex flex-col justify-between items-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white text-center">
            {/* Header */}
            <header className="w-full bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 py-4">
                <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
                    <Image
                        src="/logo svg.svg"
                        alt="Logo BetCyclingFriends"
                        width={100}
                        height={40}
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-col items-center justify-center flex-1 px-4">
                <Image
                    src="/BCF Logo Complet.svg"
                    alt="Logo BetCyclingFriends"
                    width={500}
                    height={200}
                    className="mb-10"
                />

                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
                    La V2 arrive bientôt
                </h1>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-slate-800 py-6 text-slate-500 text-sm">
                © 2025 BetCyclingFriends • Fait avec ❤️ pour les passionnés de cyclisme
            </footer>
        </div>
    );
}

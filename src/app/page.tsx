import React from 'react';
import Image from "next/image";
import { StatsBar } from '@/components/landing/StatsBar';
import { Leaderboard } from '@/components/landing/Leaderboard';

export default function Page() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">

            <header className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-lg z-50 border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/bcf_logo.svg"
                            alt="Logo BetCyclingFriends"
                            width={100}
                            height={40}
                        />
                    </div>
                    <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 hover:border-yellow-500/50">
                        Connexion
                    </button>
                </div>
            </header>

            <section className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <Image
                        src="/bcf_full.svg"
                        alt="Logo BetCyclingFriends"
                        width={600}
                        height={40}
                        className="mx-auto mb-6"
                    />

                    <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                        Crée ta ligue privée, pronostique les courses du World Tour et grimpe au classement avec tes amis
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <button className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/50 text-slate-900">
                            Créer ma ligue gratuite
                        </button>
                    </div>
                </div>
            </section>

            <StatsBar />
            <Leaderboard />
        </div>
    );
}
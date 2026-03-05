import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { StatsBar } from '@/components/landing/StatsBar';
import { Leaderboard } from '@/components/landing/Leaderboard';
import { LandingActions } from '@/components/landing/LandingActions';

export default function Page() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">



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
                        <LandingActions />
                    </div>
                </div>
            </section>

            <StatsBar />
            <Leaderboard />
        </div>
    );
}
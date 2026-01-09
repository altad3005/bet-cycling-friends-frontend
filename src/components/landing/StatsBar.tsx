"use client";

import React, { useState } from 'react';
import { Users, Trophy, Zap, TrendingUp } from 'lucide-react';

export function StatsBar() {
    const [timeLeft] = useState('2h 15min');

    return (
        <section className="py-6 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 border-y border-yellow-500/20">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-wrap justify-center gap-8 text-center">
                    <div>
                        <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-1">
                            <Users className="w-6 h-6 text-yellow-400" />
                            1,234
                        </div>
                        <div className="text-sm text-slate-400">Joueurs actifs</div>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-1">
                            <Trophy className="w-6 h-6 text-yellow-400" />
                            45
                        </div>
                        <div className="text-sm text-slate-400">Ligues en cours</div>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-1 text-red-500">
                            <Zap className="w-6 h-6 animate-pulse" />
                            LIVE
                        </div>
                        <div className="text-sm text-slate-400">Paris-Roubaix dans {timeLeft}</div>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-1">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                            245
                        </div>
                        <div className="text-sm text-slate-400">Paris en cours</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
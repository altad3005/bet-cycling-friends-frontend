import React from 'react';
import { Mountain } from 'lucide-react';

// ── Race Status ──────────────────────────────────────────────────
export type RaceStatus = 'upcoming' | 'live' | 'finished';

export function getRaceStatus(startDate: string, endDate: string): RaceStatus {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now < start) return 'upcoming';
    if (now > end) return 'finished';
    return 'live';
}

// ── Stage Profile Icon ──────────────────────────────────────────
export function renderProfileIcon(profile: string) {
    switch (profile) {
        case 'p1':
            return <div className="flex gap-0.5" title="Plat"><Mountain className="w-4 h-4 text-green-400 opacity-50" /></div>;
        case 'p2':
            return <div className="flex gap-0.5" title="Vallonné"><Mountain className="w-4 h-4 text-yellow-500 opacity-80" /></div>;
        case 'p3':
            return <div className="flex gap-0.5" title="Moyenne montagne"><Mountain className="w-4 h-4 text-orange-500" /><Mountain className="w-4 h-4 text-orange-500" /></div>;
        case 'p4':
            return <div className="flex gap-0.5" title="Montagne"><Mountain className="w-4 h-4 text-red-500" /><Mountain className="w-4 h-4 text-red-500" /></div>;
        case 'p5':
            return <div className="flex gap-0.5" title="Haute montagne"><Mountain className="w-4 h-4 text-red-600" /><Mountain className="w-4 h-4 text-red-600" /><Mountain className="w-4 h-4 text-red-600" /></div>;
        default:
            return <span className="text-xs text-slate-500 font-mono uppercase px-1.5 py-0.5 bg-slate-800 rounded">{profile}</span>;
    }
}

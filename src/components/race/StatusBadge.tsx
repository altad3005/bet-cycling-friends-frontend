import React from 'react';
import { Clock, CheckCircle, Circle } from 'lucide-react';
import { type RaceStatus } from '@/lib/race-utils';

type StatusBadgeProps = {
    status: RaceStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const badges = {
        live: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: Circle, label: 'EN DIRECT', pulse: true },
        upcoming: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Clock, label: 'À venir', pulse: false },
        finished: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: CheckCircle, label: 'Terminée', pulse: false },
    };

    const badge = badges[status] || badges.finished;
    const Icon = badge.icon;

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${badge.color}`}>
            <Icon className={`w-3 h-3 ${badge.pulse ? 'animate-pulse' : ''}`} />
            {badge.label}
        </span>
    );
}

import { type RaceType } from '@/services/race.service';

// ── Race Type Labels ──────────────────────────────────────────────
export const RACE_TYPE_LABELS: Record<RaceType, string> = {
    GRAND_TOUR: 'Grand Tour',
    MONUMENT: 'Monument',
    STAGE_RACE: 'Course par étapes',
    CLASSIC: 'Classique',
    CHAMPIONSHIP: 'Championnat',
};

// ── Leaderboard / Medal Helpers ───────────────────────────────────
export const MEDAL_GRADIENTS = [
    'from-yellow-400 to-yellow-600',
    'from-gray-300 to-gray-500',
    'from-orange-400 to-orange-600',
] as const;

export const MEDAL_EMOJIS = ['🥇', '🥈', '🥉'] as const;

export function getMedalStyles(rank: number) {
    if (rank < 3) {
        return { bg: MEDAL_GRADIENTS[rank], icon: MEDAL_EMOJIS[rank] };
    }
    return { bg: 'from-slate-700 to-slate-800', icon: `${rank + 1}e` };
}

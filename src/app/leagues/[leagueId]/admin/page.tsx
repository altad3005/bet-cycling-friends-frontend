"use client";

import React, { useState, useEffect, use } from 'react';
import { Database, Plus } from 'lucide-react';
import { raceService } from '@/services/race.service';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLeague } from '@/contexts/LeagueContext';
import { useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorAlert from '@/components/ui/ErrorAlert';
import SearchInput from '@/components/ui/SearchInput';
import GradientButton from '@/components/ui/GradientButton';

export default function LeagueAdminPage({ params }: { params: Promise<{ leagueId: string }> }) {
    const { leagueId } = use(params);
    const { user } = useAuth();
    const { members, isLoading: isLeagueLoading } = useLeague();
    const router = useRouter();

    const [slug, setSlug] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);

    useEffect(() => {
        if (!isLeagueLoading && user && members.length > 0) {
            const currentMember = members.find(m => m.user.id === user.id);
            if (!currentMember || currentMember.role?.toUpperCase() !== 'ADMIN') {
                router.push(`/leagues/${leagueId}`);
            }
        }
    }, [isLeagueLoading, user, members, router, leagueId]);

    // Add another loading state check to prevent flashing the page
    if (isLeagueLoading) {
        return <LoadingSpinner />;
    }

    const handleImport = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!slug.trim()) return;

        setIsLoading(true);
        setResult(null);

        try {
            const res = await raceService.importRace(slug.trim());
            setResult({
                success: true,
                message: res.message || 'Course importée avec succès !',
                data: res.data
            });
            setSlug('');
        } catch (error: any) {
            setResult({
                success: false,
                message: error.response?.data?.message || 'Erreur lors de l\'importation de la course. Vérifiez que le slug est correct.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 pb-20 text-white">

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold mb-1">Administration de la ligue</h2>
                    <p className="text-slate-400">Gérez les paramètres et les courses de cette ligue.</p>
                </div>
                <Link
                    href={`/leagues/${leagueId}`}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                    Retour à la ligue
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Import form section */}
                <section className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center border border-yellow-500/30">
                            <Database className="w-5 h-5 text-yellow-500" />
                        </div>
                        <h3 className="text-xl font-bold">Importer une course</h3>
                    </div>

                    <form onSubmit={handleImport} className="space-y-4 flex-1 flex flex-col">
                        <div className="flex-1">
                            <label htmlFor="slug" className="block text-sm font-medium text-slate-300 mb-2">
                                Slug ProCyclingStats (ex: <i>strade-bianche</i>)
                            </label>
                            <SearchInput
                                value={slug}
                                onChange={setSlug}
                                placeholder="Entrez le slug..."
                                disabled={isLoading}
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                Le slug est présent dans l'URL de PCS
                                (ex: procyclingstats.com/race/<strong>strade-bianche</strong>/2025).
                            </p>
                        </div>

                        {result && (
                            <ErrorAlert
                                message={result.message}
                                className={`mt-4 ${result.success ? 'bg-green-500/10 border-green-500/30 text-green-300' : ''}`}
                            />
                        )}

                        <GradientButton
                            type="submit"
                            disabled={!slug.trim() || isLoading}
                            loading={isLoading}
                            icon={Plus}
                            className="w-full py-3 mt-4"
                        >
                            {isLoading ? 'Importation...' : 'Importer la course'}
                        </GradientButton>
                    </form>
                </section>

                {/* Other admin actions could go here */}
                <section className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 opacity-50 cursor-not-allowed">
                    <h3 className="text-xl font-bold mb-4">Autres fonctionnalités</h3>
                    <p className="text-sm text-slate-400">
                        La gestion des membres, les paramètres de la ligue et d'autres options administratives seront disponibles prochainement.
                    </p>
                </section>

            </div>
        </div>
    );
}

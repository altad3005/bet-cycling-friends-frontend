"use client";

import React, { useState, use } from 'react';
import { Database, Search, Loader2, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { raceService } from '@/services/race.service';
import Link from 'next/link';

export default function LeagueAdminPage({ params }: { params: Promise<{ leagueId: string }> }) {
    const { leagueId } = use(params);

    const [slug, setSlug] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);

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
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="Entrez le slug..."
                                    className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                                    disabled={isLoading}
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Le slug est présent dans l'URL de PCS
                                (ex: procyclingstats.com/race/<strong>strade-bianche</strong>/2025).
                            </p>
                        </div>

                        {/* Result feedback inline */}
                        {result && (
                            <div className={`p-3 rounded-xl border flex items-start gap-3 text-sm mt-4 ${result.success ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
                                }`}>
                                {result.success ? (
                                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-400" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
                                )}
                                <div>
                                    <p className="font-semibold">{result.message}</p>
                                    {result.success && result.data && (
                                        <p className="mt-1 opacity-80">{result.data.name} importée avec succès.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!slug.trim() || isLoading}
                            className="w-full py-3 mt-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 rounded-xl font-semibold text-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Plus className="w-5 h-5" />
                            )}
                            {isLoading ? 'Importation...' : 'Importer la course'}
                        </button>
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

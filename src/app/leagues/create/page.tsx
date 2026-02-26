"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { leagueService } from '@/services/league.service';

export default function CreateLeaguePage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await leagueService.createLeague(name, description || undefined);
            // Redirect to the new league's page
            const leagueId = data.data?.id;
            if (leagueId) {
                router.push(`/leagues/${leagueId}`);
            } else {
                router.push('/leagues');
            }
        } catch (err: any) {
            const messages = err.response?.data?.errors;
            if (messages && messages.length > 0) {
                setError(messages.map((e: any) => e.message).join(' '));
            } else {
                setError(err.response?.data?.message || 'Erreur lors de la création de la ligue.');
            }
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <Link href="/leagues" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" />
                Retour aux ligues
            </Link>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-2">
                Créer une ligue
            </h1>
            <p className="text-slate-400 mb-8">Tu seras automatiquement l&apos;administrateur de ta nouvelle ligue.</p>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Nom de la ligue <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        minLength={3}
                        maxLength={50}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full px-4 py-3 border border-slate-700 rounded-lg bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                        placeholder="Les Grimpeurs Fous"
                    />
                    <p className="mt-1 text-xs text-slate-500">{name.length}/50 caractères</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Description <span className="text-slate-500">(optionnel)</span>
                    </label>
                    <textarea
                        maxLength={500}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="block w-full px-4 py-3 border border-slate-700 rounded-lg bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none"
                        placeholder="Une ligue pour les passionnés du Tour de France..."
                    />
                    <p className="mt-1 text-xs text-slate-500">{description.length}/500 caractères</p>
                </div>

                <div className="flex gap-4 pt-2">
                    <Link href="/leagues" className="flex-1">
                        <button
                            type="button"
                            className="w-full py-3 px-6 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors font-semibold"
                        >
                            Annuler
                        </button>
                    </Link>
                    <button
                        type="submit"
                        disabled={loading || name.length < 3}
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 rounded-xl font-bold text-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Plus className="w-5 h-5" />
                                Créer la ligue
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

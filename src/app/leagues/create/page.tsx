"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { leagueService } from '@/services/league.service';

import BackLink from '@/components/ui/BackLink';
import ErrorAlert from '@/components/ui/ErrorAlert';
import GradientButton from '@/components/ui/GradientButton';

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
            <BackLink href="/leagues" label="Retour aux ligues" className="mb-8" />

            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-2">
                Créer une ligue
            </h1>
            <p className="text-slate-400 mb-8">Tu seras automatiquement l&apos;administrateur de ta nouvelle ligue.</p>

            <ErrorAlert message={error} className="mb-6" />

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
                        <GradientButton variant="secondary" className="w-full py-3">
                            Annuler
                        </GradientButton>
                    </Link>
                    <GradientButton
                        type="submit"
                        disabled={name.length < 3}
                        loading={loading}
                        icon={Plus}
                        className="flex-1 py-3"
                    >
                        Créer la ligue
                    </GradientButton>
                </div>
            </form>
        </div >
    );
}

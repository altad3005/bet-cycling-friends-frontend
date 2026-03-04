"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut } from 'lucide-react';
import BackLink from '@/components/ui/BackLink';
import GradientButton from '@/components/ui/GradientButton';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProfilePage() {
    const { user, logout, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSpinner size="page" />;
    }

    if (!user) {
        return (
            <div className="min-h-[80vh] px-4 py-12">
                <EmptyState
                    icon={User}
                    title="Non connecté"
                    subtitle="Veuillez vous connecter pour voir votre profil."
                    className="max-w-2xl mx-auto bg-slate-900/50 rounded-2xl border border-slate-800"
                />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <BackLink href="/leagues" label="Retour aux ligues" />

            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 shadow-xl">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center font-bold text-5xl text-slate-900 shadow-lg shrink-0">
                        {user.pseudo[0].toUpperCase()}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-2">
                            {user.pseudo}
                        </h1>
                        <p className="text-slate-400 text-lg mb-6 flex items-center justify-center md:justify-start gap-2">
                            <User className="w-5 h-5" />
                            Membre BetCyclingFriends
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <GradientButton onClick={logout} variant="secondary" icon={LogOut}>
                                Se déconnecter
                            </GradientButton>
                        </div>
                    </div>
                </div>
            </div>

            <EmptyState
                icon={User}
                title="Tableau de bord de profil"
                subtitle="D'autres fonctionnalités comme les statistiques globales ou l'historique viendront bientôt."
                className="bg-slate-900/50 rounded-2xl border border-slate-800"
            />
        </div>
    );
}

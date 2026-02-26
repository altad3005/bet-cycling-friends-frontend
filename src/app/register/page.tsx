"use client";

import React, { useState } from 'react';
import { Mail, Lock, UserPlus, AlertCircle, AtSign } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [pseudo, setPseudo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        if (password.length < 12) {
            setError('Le mot de passe doit contenir au moins 12 caractères.');
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(pseudo)) {
            setError('Le pseudo ne peut contenir que des lettres, chiffres et underscores.');
            return;
        }

        setLoading(true);

        try {
            // Sends exactly what the backend validator expects: { pseudo, email, password }
            const data = await authService.register({ pseudo, email, password });

            // Backend register does NOT return a token — redirect to login
            router.push('/login?registered=1');
        } catch (err: any) {
            const messages = err.response?.data?.errors;
            if (messages && messages.length > 0) {
                setError(messages.map((e: any) => e.message).join(' '));
            } else {
                setError(err.response?.data?.message || 'Erreur lors de la création du compte. Veuillez réessayer.');
            }
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[85vh] px-4 py-8">
            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-lg rounded-2xl p-8 border border-slate-800 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <Image
                        src="/bcf_logo.svg"
                        alt="Logo BetCyclingFriends"
                        width={60}
                        height={60}
                        className="mb-4"
                    />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                        S&apos;inscrire
                    </h1>
                    <p className="text-slate-400 mt-2 text-center">
                        Rejoignez la communauté et pariez avec vos amis !
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Pseudo */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Pseudo
                            <span className="ml-1 text-xs text-slate-500">(lettres, chiffres, _ — min. 3 caractères)</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <AtSign className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="text"
                                required
                                minLength={3}
                                maxLength={30}
                                pattern="^[a-zA-Z0-9_]+"
                                value={pseudo}
                                onChange={(e) => setPseudo(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                placeholder="MonPseudo42"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Adresse Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                placeholder="votre@email.com"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Mot de passe
                            <span className="ml-1 text-xs text-slate-500">(min. 12 caractères)</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={12}
                                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                placeholder="••••••••••••"
                            />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Confirmer le mot de passe
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength={12}
                                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                placeholder="••••••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-slate-900 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <UserPlus className="w-5 h-5" />
                                Créer mon compte
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-400">
                        Vous avez déjà un compte ?{' '}
                        <Link href="/login" className="font-semibold text-yellow-500 hover:text-yellow-400 transition-colors">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

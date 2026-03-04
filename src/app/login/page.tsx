"use client";

import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ErrorAlert from '@/components/ui/ErrorAlert';
import FormInput from '@/components/ui/FormInput';
import GradientButton from '@/components/ui/GradientButton';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await authService.login(email, password);
            // Backend response: { message, data: { user, token: "..." } }
            const token = data.data?.token;
            if (token) {
                login(token);
            } else {
                setError('Réponse inattendue du serveur. Veuillez réessayer.');
                setLoading(false);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Identifiants incorrects. Veuillez réessayer.');
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
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
                        Connexion
                    </h1>
                    <p className="text-slate-400 mt-2 text-center">
                        Accédez à vos ligues et pronostics
                    </p>
                </div>

                <ErrorAlert message={error} className="mb-6" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormInput
                        label="Adresse Email"
                        icon={Mail}
                        type="email"
                        required
                        value={email}
                        onChange={setEmail}
                        placeholder="votre@email.com"
                    />

                    <FormInput
                        label="Mot de passe"
                        icon={Lock}
                        type="password"
                        required
                        value={password}
                        onChange={setPassword}
                        placeholder="••••••••"
                    />

                    <GradientButton
                        type="submit"
                        loading={loading}
                        icon={LogIn}
                        className="w-full mt-6"
                    >
                        Se connecter
                    </GradientButton>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-400">
                        Pas encore de compte ?{' '}
                        <Link href="/register" className="font-semibold text-yellow-500 hover:text-yellow-400 transition-colors">
                            S&apos;inscrire
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

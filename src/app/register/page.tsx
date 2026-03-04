"use client";

import React, { useState } from 'react';
import { Mail, Lock, UserPlus, AtSign } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ErrorAlert from '@/components/ui/ErrorAlert';
import FormInput from '@/components/ui/FormInput';
import GradientButton from '@/components/ui/GradientButton';

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

                <ErrorAlert message={error} className="mb-6" />

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput
                        label="Pseudo"
                        hint="(lettres, chiffres, _ — min. 3 caractères)"
                        icon={AtSign}
                        required
                        minLength={3}
                        maxLength={30}
                        pattern="^[a-zA-Z0-9_]+"
                        value={pseudo}
                        onChange={setPseudo}
                        placeholder="MonPseudo42"
                    />

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
                        hint="(min. 12 caractères)"
                        icon={Lock}
                        type="password"
                        required
                        minLength={12}
                        value={password}
                        onChange={setPassword}
                        placeholder="••••••••••••"
                    />

                    <FormInput
                        label="Confirmer le mot de passe"
                        icon={Lock}
                        type="password"
                        required
                        minLength={12}
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        placeholder="••••••••••••"
                    />

                    <GradientButton
                        type="submit"
                        loading={loading}
                        icon={UserPlus}
                        className="w-full mt-6"
                    >
                        Créer mon compte
                    </GradientButton>
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

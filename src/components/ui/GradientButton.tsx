import React from 'react';
import { Loader2 } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

type GradientButtonProps = {
    children: React.ReactNode;
    icon?: LucideIcon;
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit';
    onClick?: () => void;
    className?: string;
    /** 'primary' = yellow/amber CTA, 'secondary' = slate */
    variant?: 'primary' | 'secondary';
};

export default function GradientButton({
    children,
    icon: Icon,
    loading = false,
    disabled = false,
    type = 'button',
    onClick,
    className = '',
    variant = 'primary',
}: GradientButtonProps) {
    const base = 'px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-900',
        secondary: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${base} ${variants[variant]} ${className}`}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : Icon ? (
                <Icon className="w-5 h-5" />
            ) : null}
            {children}
        </button>
    );
}

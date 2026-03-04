import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type BackLinkProps = {
    href: string;
    label?: string;
    className?: string;
};

export default function BackLink({ href, label = 'Retour', className }: BackLinkProps) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors ${className || ''}`}
        >
            <ArrowLeft className="w-4 h-4" />
            {label}
        </Link>
    );
}

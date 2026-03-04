import React from 'react';
import { type LucideIcon } from 'lucide-react';

type EmptyStateProps = {
    icon: LucideIcon;
    title: string;
    subtitle?: string;
    className?: string;
};

export default function EmptyState({ icon: Icon, title, subtitle, className }: EmptyStateProps) {
    return (
        <div className={`text-center py-12 ${className || ''}`}>
            <Icon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-300 mb-2">{title}</h3>
            {subtitle && <p className="text-slate-500">{subtitle}</p>}
        </div>
    );
}

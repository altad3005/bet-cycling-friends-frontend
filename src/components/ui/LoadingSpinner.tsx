import React from 'react';
import { Loader2 } from 'lucide-react';

type LoadingSpinnerProps = {
    /** Use 'page' for full-page centering, 'section' for inline section centering */
    size?: 'page' | 'section';
    className?: string;
};

export default function LoadingSpinner({ size = 'page', className }: LoadingSpinnerProps) {
    const wrapperClass = size === 'page'
        ? 'flex items-center justify-center min-h-[50vh]'
        : 'flex items-center justify-center py-20';

    return (
        <div className={className || wrapperClass}>
            <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
        </div>
    );
}

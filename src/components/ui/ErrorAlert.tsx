import React from 'react';
import { AlertCircle } from 'lucide-react';

type ErrorAlertProps = {
    message: string;
    className?: string;
};

export default function ErrorAlert({ message, className }: ErrorAlertProps) {
    if (!message) return null;

    return (
        <div className={`p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 ${className || ''}`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{message}</span>
        </div>
    );
}

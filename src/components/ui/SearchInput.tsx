import React from 'react';
import { Search } from 'lucide-react';

type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
};

export default function SearchInput({
    value,
    onChange,
    placeholder = 'Rechercher...',
    disabled = false,
    className = '',
}: SearchInputProps) {
    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500/50 transition-colors"
            />
        </div>
    );
}

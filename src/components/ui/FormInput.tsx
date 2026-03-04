import React from 'react';
import { type LucideIcon } from 'lucide-react';

type FormInputProps = {
    icon: LucideIcon;
    label: string;
    hint?: string;
    type?: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
};

export default function FormInput({
    icon: Icon,
    label,
    hint,
    type = 'text',
    required,
    value,
    onChange,
    placeholder,
    minLength,
    maxLength,
    pattern,
}: FormInputProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
                {label}
                {hint && <span className="ml-1 text-xs text-slate-500">{hint}</span>}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-slate-500" />
                </div>
                <input
                    type={type}
                    required={required}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                    placeholder={placeholder}
                    minLength={minLength}
                    maxLength={maxLength}
                    pattern={pattern}
                />
            </div>
        </div>
    );
}

"use client";

import React from 'react';
import { Users, X } from 'lucide-react';

// Define a type for the participant for better type safety
type Participant = {
    name: string;
    avatar: string;
    isAdmin: boolean;
};

type ParticipantsPanelProps = {
    isOpen: boolean;
    onClose: () => void;
    participants: Participant[];
};

const ParticipantsPanel = ({ isOpen, onClose, participants }: ParticipantsPanelProps) => {
    return (
        <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
            ></div>

            {/* Panel */}
            <div
                className={`absolute top-0 right-0 h-full w-full max-w-md bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between p-4 border-b border-slate-800">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Users className="w-6 h-6 text-yellow-400" />
                            Participants ({participants.length})
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </header>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {participants.map((participant, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center font-bold text-slate-900 text-lg">
                                        {participant.avatar}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{participant.name}</div>
                                    </div>
                                </div>
                                {participant.isAdmin && (
                                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold border border-purple-500/30">
                                        Admin
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParticipantsPanel;

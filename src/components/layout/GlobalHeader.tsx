"use client";

import React from 'react';
import Image from 'next/image';
import UserProfileMenu from './UserProfileMenu';
import Link from 'next/link';

export default function GlobalHeader() {
    return (
        <header className="bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/leagues" className="flex items-center gap-3">
                        <Image
                            src="/bcf_logo.svg"
                            alt="Logo BetCyclingFriends"
                            width={40}
                            height={40}
                        />
                    </Link>

                    {/* User Menu */}
                    <UserProfileMenu />
                </div>
            </div>
        </header>
    );
}

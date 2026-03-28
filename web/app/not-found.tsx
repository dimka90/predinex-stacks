'use client';

import Link from 'next/link';
import Navbar from './components/Navbar';
import { Compass, ArrowLeft, ShieldAlert, Home, Search } from 'lucide-react';

/**
 * NotFound - Premium 404 terminal for the Predinex protocol.
 */
export default function NotFound() {
    return (
        <main className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative z-10 text-center">
                {/* 404 Visual */}
                <div className="relative mb-8 sm:mb-12">
                    <span className="text-[25vw] sm:text-[200px] font-black text-white/5 tracking-tighter select-none leading-none">404</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ShieldAlert size={80} className="text-primary animate-pulse-subtle" />
                    </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 uppercase">
                    Terminal <span className="gradient-text">Exception</span>
                </h1>

                <p className="max-w-md mx-auto text-lg text-muted-foreground mb-12 leading-relaxed">
                    The requested terminal endpoint or market identifier does not exist or has been retired from the protocol.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-sm sm:max-w-none">
                    <Link
                        href="/"
                        className="btn-primary flex items-center justify-center gap-3 w-full sm:w-auto px-10"
                    >
                        <Home size={18} />
                        RETURN TO HUB
                    </Link>
                    <Link
                        href="/explore"
                        className="glass-panel px-10 py-4 flex items-center justify-center gap-3 w-full sm:w-auto border-white/10 hover:bg-white/10 transition-all active:scale-95"
                    >
                        <Search size={18} />
                        EXPLORE MARKETS
                    </Link>
                </div>

                {/* Error ID for debugging */}
                <div className="mt-24 px-4 py-2 rounded-lg bg-white/5 border border-white/5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    ERROR_NODE_ID: {Math.random().toString(36).substring(7).toUpperCase()}
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        </main>
    );
}

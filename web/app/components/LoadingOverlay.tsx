'use client';

import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
    isLoading: boolean;
    message?: string;
    className?: string;
}

/**
 * LoadingOverlay - Full-screen or container-level loading state
 * with blur backdrop and animated spinner.
 */
export default function LoadingOverlay({ isLoading, message = 'Loading...', className = '' }: LoadingOverlayProps) {
    if (!isLoading) return null;

    return (
        <div role="alert" aria-live="assertive" aria-busy="true" className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-2xl animate-in fade-in duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}>
            <div className="flex flex-col items-center gap-6 p-10 rounded-[2.5rem] glass-card shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] -mr-16 -mt-16 pointer-events-none" />
                <div className="relative z-10">
                    <div className="w-16 h-16 rounded-full border-2 border-white/10 shadow-inner" />
                    <Loader2 size={32} className="absolute inset-0 m-auto text-primary drop-shadow-[0_0_10px_rgba(79,70,229,0.8)] animate-spin" />
                </div>
                <p className="text-xs font-black text-white tracking-[0.2em] uppercase relative z-10">{message}</p>
            </div>
        </div>
    );
}

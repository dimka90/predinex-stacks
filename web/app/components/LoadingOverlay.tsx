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
        <div className={`absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200 ${className}`}>
            <div className="flex flex-col items-center gap-4 p-8 rounded-2xl glass-panel">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-primary/20" />
                    <Loader2 size={24} className="absolute inset-0 m-auto text-primary animate-spin" />
                </div>
                <p className="text-sm font-bold text-muted-foreground tracking-wide">{message}</p>
            </div>
        </div>
    );
}

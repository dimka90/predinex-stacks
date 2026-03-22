'use client';

import { ReactNode } from 'react';

interface SkeletonLoaderProps {
    variant?: 'card' | 'list' | 'text' | 'market' | 'circle';
    count?: number;
    className?: string;
}

export default function SkeletonLoader({
    variant = 'text',
    count = 1,
    className = ""
}: SkeletonLoaderProps) {
    const renderSkeleton = () => {
        switch (variant) {
            case 'card':
                return (
                    <div className="glass-panel p-8 rounded-3xl animate-pulse space-y-6">
                        <div className="h-4 bg-muted rounded w-1/4" />
                        <div className="space-y-3">
                            <div className="h-8 bg-muted rounded w-3/4" />
                            <div className="h-4 bg-muted rounded w-full" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-6">
                            <div className="h-12 bg-muted rounded" />
                            <div className="h-12 bg-muted rounded" />
                        </div>
                        <div className="h-12 bg-primary/20 rounded-xl" />
                    </div>
                );
            case 'market':
                return (
                    <div className="glass-panel p-8 rounded-3xl animate-pulse space-y-6 border border-border/10">
                        <div className="flex justify-between">
                            <div className="h-6 bg-muted rounded-full w-24" />
                            <div className="h-6 bg-muted rounded-full w-12" />
                        </div>
                        <div className="h-8 bg-muted rounded w-5/6" />
                        <div className="space-y-2">
                            <div className="h-4 bg-muted rounded w-full" />
                            <div className="h-4 bg-muted rounded w-4/6" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/10">
                            <div className="h-10 bg-muted rounded" />
                            <div className="h-10 bg-muted rounded" />
                        </div>
                    </div>
                );
            case 'list':
                return (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-16 bg-muted/50 rounded-2xl w-full" />
                        <div className="h-16 bg-muted/50 rounded-2xl w-full" />
                        <div className="h-16 bg-muted/50 rounded-2xl w-full" />
                    </div>
                );
            case 'circle':
                return <div className={`rounded-full bg-muted animate-pulse ${className}`} />;
            case 'text':
            default:
                return <div className={`h-4 bg-muted rounded animate-pulse ${className}`} />;
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i}>{renderSkeleton()}</div>
            ))}
        </div>
    );
}

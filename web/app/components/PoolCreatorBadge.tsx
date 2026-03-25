'use client';

import { Shield, ShieldCheck } from 'lucide-react';

interface PoolCreatorBadgeProps {
    creatorAddress: string;
    isVerified?: boolean;
    className?: string;
}

/**
 * PoolCreatorBadge - Shows the pool creator with optional verification.
 */
export default function PoolCreatorBadge({ creatorAddress, isVerified = false, className = '' }: PoolCreatorBadgeProps) {
    const truncated = `${creatorAddress.slice(0, 5)}...${creatorAddress.slice(-4)}`;

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs ${className}`}>
            {isVerified ? (
                <ShieldCheck size={12} className="text-green-400" />
            ) : (
                <Shield size={12} className="text-muted-foreground" />
            )}
            <span className="font-mono text-muted-foreground">{truncated}</span>
            {isVerified && (
                <span className="text-[9px] font-black uppercase tracking-widest text-green-400">Verified</span>
            )}
        </div>
    );
}

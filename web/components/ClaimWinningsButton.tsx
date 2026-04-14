"use client";

import { useState, useEffect } from 'react';
import { callContract } from '@/lib/appkit-transactions';
import { uintCV } from '@stacks/transactions';
import { useAppKitAccount } from '@reown/appkit/react';
import { Loader2, Coins } from 'lucide-react';

interface ClaimWinningsButtonProps {
    poolId: number;
    isSettled: boolean;
    userHasWinnings: boolean;
}

export default function ClaimWinningsButton({ poolId, isSettled, userHasWinnings }: ClaimWinningsButtonProps) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isConnected } = useAppKitAccount();

    const handleClaim = async () => {
        if (!isConnected) return;

        setIsPending(true);
        setError(null);

        try {
            await callContract({
                contractAddress: 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N',
                contractName: 'predinex-pool-1771407097278',
                functionName: 'claim-winnings',
                functionArgs: [uintCV(poolId)],
                onFinish: (data) => {
                    console.log('Claim submitted:', data);
                    setIsPending(false);
                },
                onCancel: () => {
                    setIsPending(false);
                }
            });
        } catch (err: any) {
            console.error('Claim error:', err);
            setError(err.message || 'Failed to claim');
            setIsPending(false);
        }
    };

    if (!isSettled || !userHasWinnings) return null;

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handleClaim}
                disabled={isPending}
                className="flex items-center justify-center gap-3 px-8 py-4 md:py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_15px_35px_rgba(245,158,11,0.3)] hover:shadow-[0_20px_45px_rgba(245,158,11,0.5)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden border border-white/20 min-h-[48px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                ) : (
                    <Coins className="w-5 h-5 group-hover:rotate-12 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all relative z-10" />
                )}
                <span className="relative z-10 text-sm">{isPending ? 'PROCESSING' : 'CLAIM WINNINGS'}</span>
            </button>
            {error && <p className="text-red-400 text-[10px] uppercase font-black tracking-widest text-center mt-1 animate-pulse bg-red-500/10 py-1 rounded-lg border border-red-500/20">{error}</p>}
        </div>
    );
}

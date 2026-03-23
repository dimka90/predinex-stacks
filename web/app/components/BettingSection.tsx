'use client';

import { useState, useEffect } from 'react';
import { useStacks } from './StacksProvider';
import { useWalletConnection } from '../../lib/hooks/useWalletConnection';
import { useToast } from '../../providers/ToastProvider';
import { openContractCall } from '@stacks/connect';
import { uintCV } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../../lib/constants';
import { Loader2, Wallet, AlertCircle, Zap, TrendingUp, Info } from 'lucide-react';
import { Pool } from '../../lib/stacks-api';
import { formatCurrency } from '../../lib/market-utils';

interface BettingSectionProps {
    pool: Pool;
    poolId: number;
}

export default function BettingSection({ pool, poolId }: BettingSectionProps) {
    const { userData, authenticate } = useStacks();
    const { isConnected, address } = useWalletConnection();
    const { showToast } = useToast();
    const [betAmount, setBetAmount] = useState("");
    const [isBetting, setIsBetting] = useState(false);
    const [walletBalance, setWalletBalance] = useState<number | null>(null);

    // Fetch wallet balance when connection changes
    useEffect(() => {
        if (isConnected) {
            // In a real app, fetch balance from API
            setWalletBalance(100.0); // Mock balance for testing
        } else {
            setWalletBalance(null);
        }
    }, [isConnected]);

    const placeBet = async (outcome: number) => {
        if (!userData) {
            authenticate();
            return;
        }

        const amount = parseFloat(betAmount);
        if (!betAmount || isNaN(amount) || amount <= 0) {
            showToast("Please enter a valid bet amount greater than 0.", "error");
            return;
        }

        if (amount < 0.1) {
            showToast("Minimum bet amount is 0.1 STX.", "error");
            return;
        }

        // Check wallet balance
        if (walletBalance !== null && amount > walletBalance) {
            showToast(`Insufficient balance. You have ${walletBalance} STX.`, "error");
            return;
        }

        setIsBetting(true);
        const amountInMicroStx = Math.floor(parseFloat(betAmount) * 1_000_000);

        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'place-bet',
                functionArgs: [
                    uintCV(poolId),
                    uintCV(outcome),
                    uintCV(amountInMicroStx),
                ],
                onFinish: (data) => {
                    console.log('Bet placed successfully:', data);
                    showToast(`Bet placed successfully!`, "success");
                    setIsBetting(false);
                    setBetAmount("");
                },
                onCancel: () => {
                    console.log('User cancelled bet transaction');
                    showToast("Transaction cancelled", "info");
                    setIsBetting(false);
                },
            });
        } catch (error) {
            console.error("Bet transaction failed:", error);
            showToast(`Bet failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`, "error");
            setIsBetting(false);
        }
    };

    if (pool.settled) {
        return (
            <div className="text-center py-6 bg-muted/50 rounded-lg">
                <p className="text-lg font-bold">This pool has been settled.</p>
                <p className="text-muted-foreground">Winner: {pool.winningOutcome === 0 ? pool.outcomeA : pool.outcomeB}</p>
            </div>
        );
    }

    if (!userData && !isConnected) {
        return (
            <div className="text-center py-6 bg-muted/50 rounded-lg">
                <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-bold mb-2">Connect Wallet to Bet</p>
                <p className="text-muted-foreground mb-4">You need to connect your wallet to place bets on this market.</p>
                <button
                    onClick={authenticate}
                    className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-full border border-primary/20 transition-colors font-medium mx-auto hover:scale-105 transform transition-transform"
                >
                    <Wallet className="w-5 h-5" />
                    Connect Wallet
                </button>
            </div>
        );
    }

    return (
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-card/10 relative overflow-hidden group">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <Zap size={18} className="text-primary fill-primary/20" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em]">Execution Terminal</h3>
                </div>
                {isConnected && (
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Online</span>
                    </div>
                )}
            </div>

            {/* Wallet Info */}
            {isConnected && address && (
                <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Portfolio Balance</span>
                            <span className="text-2xl font-black">{walletBalance?.toFixed(2) || '0.00'} <span className="text-muted-foreground font-medium text-sm">STX</span></span>
                        </div>
                        <button
                            onClick={() => setBetAmount(walletBalance?.toString() || "")}
                            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl border border-primary/20 transition-all hover:scale-105"
                        >
                            Max
                        </button>
                    </div>
                </div>
            )}

            {/* QUICK PRESETS */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                {[10, 50, 100].map(amt => (
                    <button
                        key={amt}
                        onClick={() => setBetAmount(amt.toString())}
                        className="py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-xs font-black uppercase tracking-widest transition-all hover:border-primary/30"
                    >
                        {amt} STX
                    </button>
                ))}
            </div>

            {/* Bet Amount Input */}
            <div className="mb-8 group/input">
                <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Size</label>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Available: {walletBalance || 0}</span>
                </div>
                <div className="relative">
                    <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        className="w-full bg-white/5 border border-white/5 group-hover/input:border-white/10 focus:border-primary/50 rounded-2xl px-6 py-5 focus:outline-none transition-all text-xl font-black placeholder:text-muted-foreground/30"
                        placeholder="0.00"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        disabled={isBetting}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-black text-muted-foreground select-none">
                        STX
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
                <button
                    onClick={() => placeBet(0)}
                    disabled={isBetting || !betAmount}
                    className="w-full py-6 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all disabled:opacity-50 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-1 active:translate-y-0 group"
                >
                    {isBetting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (
                        <div className="flex items-center justify-center gap-3">
                            <span>Execute Order: {pool.outcomeA}</span>
                            <TrendingUp size={20} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    )}
                </button>

                <button
                    onClick={() => placeBet(1)}
                    disabled={isBetting || !betAmount}
                    className="w-full py-5 bg-white/5 hover:bg-white/10 text-foreground/80 font-black uppercase tracking-widest rounded-2xl border border-white/5 transition-all disabled:opacity-50"
                >
                    Counter with: {pool.outcomeB}
                </button>
            </div>

            {/* Terminal Info */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-muted-foreground">
                <Info size={14} className="opacity-50" />
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-50">Settlement occurs on-chain within ~10 minutes</span>
            </div>
        </div>
    );
}
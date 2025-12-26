'use client';

import { useState, useEffect } from 'react';
import { useStacks } from './StacksProvider';
import { useWalletConnect } from '../lib/hooks/useWalletConnect';
import { openContractCall } from '@stacks/connect';
import { uintCV } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../lib/constants';
import { Loader2, Wallet, AlertCircle } from 'lucide-react';
import { Pool } from '../lib/stacks-api';

interface BettingSectionProps {
    pool: Pool;
    poolId: number;
}

export default function BettingSection({ pool, poolId }: BettingSectionProps) {
    const { userData, authenticate } = useStacks();
    const { session } = useWalletConnect();
    const [betAmount, setBetAmount] = useState("");
    const [isBetting, setIsBetting] = useState(false);
    const [walletBalance, setWalletBalance] = useState<number | null>(null);

    // Fetch wallet balance when session changes
    useEffect(() => {
        if (session?.isConnected) {
            // In a real app, fetch balance from API
            setWalletBalance(session.balance || 0);
        }
    }, [session]);

    const placeBet = async (outcome: number) => {
        if (!userData) {
            authenticate();
            return;
        }

        const amount = parseFloat(betAmount);
        if (!betAmount || isNaN(amount) || amount <= 0) {
            alert("Please enter a valid bet amount greater than 0.");
            return;
        }

        if (amount < 0.1) {
            alert("Minimum bet amount is 0.1 STX.");
            return;
        }

        // Check wallet balance
        if (walletBalance !== null && amount > walletBalance) {
            alert(`Insufficient balance. You have ${walletBalance} STX.`);
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
                    alert(`Bet placed successfully! Transaction ID: ${data.txId}`);
                    setIsBetting(false);
                    setBetAmount("");
                },
                onCancel: () => {
                    console.log('User cancelled bet transaction');
                    setIsBetting(false);
                },
            });
        } catch (error) {
            console.error("Bet transaction failed:", error);
            alert(`Bet failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
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

    if (!userData && !session?.isConnected) {
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
        <div className="space-y-4">
            {/* Wallet Info */}
            {session?.isConnected && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-muted-foreground">Connected Wallet</p>
                            <p className="font-mono text-sm">{session.address.slice(0, 8)}...{session.address.slice(-6)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Balance</p>
                            <p className="font-bold">{walletBalance?.toFixed(2) || '0'} STX</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Balance Warning */}
            {walletBalance !== null && walletBalance < 0.1 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-600">Insufficient balance to place bets. Minimum: 0.1 STX</p>
                </div>
            )}

            {/* Bet Amount Input */}
            <div>
                <label className="block text-sm font-medium mb-2">Bet Amount (STX)</label>
                <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g., 10"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    disabled={isBetting || (walletBalance !== null && walletBalance < 0.1)}
                    aria-label="Enter bet amount in STX"
                />
            </div>

            {/* Bet Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => placeBet(0)}
                    disabled={isBetting || (walletBalance !== null && walletBalance < 0.1)}
                    className="py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {isBetting ? <Loader2 className="w-5 h-5 animate-spin" /> : `Bet on ${pool.outcomeA}`}
                </button>
                <button
                    onClick={() => placeBet(1)}
                    disabled={isBetting || (walletBalance !== null && walletBalance < 0.1)}
                    className="py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {isBetting ? <Loader2 className="w-5 h-5 animate-spin" /> : `Bet on ${pool.outcomeB}`}
                </button>
            </div>
        </div>
    );
}
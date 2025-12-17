'use client';

import { useState } from 'react';
import { useStacks } from './StacksProvider';
import { openContractCall } from '@stacks/connect';
import { uintCV } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../lib/constants';
import { Loader2, Wallet } from 'lucide-react';
import { Pool } from '../lib/stacks-api';

interface BettingSectionProps {
    pool: Pool;
    poolId: number;
}

export default function BettingSection({ pool, poolId }: BettingSectionProps) {
    const { userData, authenticate } = useStacks();
    const [betAmount, setBetAmount] = useState("");
    const [isBetting, setIsBetting] = useState(false);

    const placeBet = async (outcome: number) => {
        if (!userData) {
            authenticate();
            return;
        }

        if (!betAmount || parseFloat(betAmount) <= 0) {
            alert("Please enter a valid bet amount.");
            return;
        }

        setIsBetting(true);
        const amountInMicroStx = Math.floor(parseFloat(betAmount) * 1_000_000); // STX to microSTX

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

    if (!userData) {
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
                    disabled={isBetting}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => placeBet(0)}
                    disabled={isBetting}
                    className="py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {isBetting ? <Loader2 className="w-5 h-5 animate-spin" /> : `Bet on ${pool.outcomeA}`}
                </button>
                <button
                    onClick={() => placeBet(1)}
                    disabled={isBetting}
                    className="py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {isBetting ? <Loader2 className="w-5 h-5 animate-spin" /> : `Bet on ${pool.outcomeB}`}
                </button>
            </div>
        </div>
    );
}
'use client';

import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { getPool, Pool } from "../../lib/stacks-api";
import { useStacks } from "../../components/StacksProvider";
import { openContractCall } from "@stacks/connect";
import { uintCV } from "@stacks/transactions";
import { CONTRACT_ADDRESS, CONTRACT_NAME } from "../../lib/constants";
import { Loader2, TrendingUp, Users, Clock } from "lucide-react";
import { use } from "react";

export default function PoolDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const poolId = parseInt(id);

    const { userData, authenticate } = useStacks();
    const [pool, setPool] = useState<Pool | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [betAmount, setBetAmount] = useState("");
    const [isBetting, setIsBetting] = useState(false);

    useEffect(() => {
        getPool(poolId).then(data => {
            setPool(data);
            setIsLoading(false);
        });
    }, [poolId]);

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
                    console.log('Bet placed:', data);
                    alert(`Bet placed! TxId: ${data.txId}`);
                    setIsBetting(false);
                    setBetAmount("");
                },
                onCancel: () => {
                    setIsBetting(false);
                },
            });
        } catch (error) {
            console.error("Bet failed", error);
            setIsBetting(false);
        }
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background text-foreground">
                <Navbar />
                <div className="pt-32 text-center">Loading pool...</div>
            </main>
        );
    }

    if (!pool) {
        return (
            <main className="min-h-screen bg-background text-foreground">
                <Navbar />
                <div className="pt-32 text-center text-red-500">Pool not found.</div>
            </main>
        );
    }

    const totalVolume = pool.totalA + pool.totalB;
    const oddsA = totalVolume > 0 ? ((pool.totalA / totalVolume) * 100).toFixed(1) : 50;
    const oddsB = totalVolume > 0 ? ((pool.totalB / totalVolume) * 100).toFixed(1) : 50;

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="pt-32 pb-20 max-w-3xl mx-auto px-4 sm:px-6">
                <div className="glass p-8 rounded-2xl border border-border">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <span className="text-xs font-mono text-muted-foreground">#POOL-{pool.id}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${pool.settled ? 'bg-zinc-800 text-zinc-400' : 'bg-green-500/10 text-green-500'}`}>
                            {pool.settled ? 'Settled' : 'Active'}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold mb-3">{pool.title}</h1>
                    <p className="text-muted-foreground mb-8">{pool.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                            <TrendingUp className="w-5 h-5 mx-auto mb-2 text-primary" />
                            <p className="text-sm text-muted-foreground">Total Volume</p>
                            <p className="font-bold">{(totalVolume / 1_000_000).toLocaleString()} STX</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                            <Users className="w-5 h-5 mx-auto mb-2 text-accent" />
                            <p className="text-sm text-muted-foreground">Creator</p>
                            <p className="font-mono text-xs truncate">{pool.creator.slice(0, 8)}...</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                            <Clock className="w-5 h-5 mx-auto mb-2 text-yellow-500" />
                            <p className="text-sm text-muted-foreground">Expires</p>
                            <p className="font-bold">Block {pool.expiry}</p>
                        </div>
                    </div>

                    {/* Odds Display */}
                    <div className="mb-8">
                        <p className="text-sm text-muted-foreground mb-2">Current Odds</p>
                        <div className="flex h-4 rounded-full overflow-hidden">
                            <div
                                className="bg-green-500 transition-all"
                                style={{ width: `${oddsA}%` }}
                            />
                            <div
                                className="bg-red-500 transition-all"
                                style={{ width: `${oddsB}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-sm">
                            <span className="text-green-400">{pool.outcomeA}: {oddsA}%</span>
                            <span className="text-red-400">{pool.outcomeB}: {oddsB}%</span>
                        </div>
                    </div>

                    {/* Betting UI */}
                    {!pool.settled && (
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
                    )}

                    {pool.settled && (
                        <div className="text-center py-6 bg-muted/50 rounded-lg">
                            <p className="text-lg font-bold">This pool has been settled.</p>
                            <p className="text-muted-foreground">Winner: {pool.winningOutcome === 0 ? pool.outcomeA : pool.outcomeB}</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

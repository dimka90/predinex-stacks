'use client';

import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { fetchActivePools, Pool } from "../lib/stacks-api";
import Link from "next/link";
import { Clock, TrendingUp } from "lucide-react";

export default function Markets() {
    const [pools, setPools] = useState<Pool[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchActivePools().then(data => {
            setPools(data);
            setIsLoading(false);
        });
    }, []);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
                <h1 className="text-3xl font-bold mb-8">Active Markets</h1>

                {isLoading ? (
                    <div className="text-center py-20">Loading markets...</div>
                ) : pools.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        No active pools found. <Link href="/create" className="text-primary underline">Create one?</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pools.map((pool) => (
                            <Link key={pool.id} href={`/markets/${pool.id}`}>
                                <div className="glass p-6 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group h-full flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-xs font-mono text-muted-foreground">#POOL-{pool.id}</span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${pool.settled ? 'bg-zinc-800 text-zinc-400' : 'bg-green-500/10 text-green-500'}`}>
                                                {pool.settled ? 'Settled' : 'Active'}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{pool.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-6 line-clamp-3">{pool.description}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm p-3 bg-muted/50 rounded-lg">
                                            <span className="font-medium text-green-400">{pool.outcomeA}</span>
                                            <span className="text-muted-foreground text-xs">vs</span>
                                            <span className="font-medium text-red-400">{pool.outcomeB}</span>
                                        </div>

                                        <div className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <TrendingUp className="w-4 h-4" />
                                                <span>{(pool.totalA + pool.totalB).toLocaleString()} STX</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Clock className="w-4 h-4" />
                                                <span>Block {pool.expiry}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

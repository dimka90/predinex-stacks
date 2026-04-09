"use client";

import { useEffect, useState } from 'react';
import { getTotalVolume, getMarkets } from '@/lib/stacks-api';
import { BarChart3, Users, Layers, Activity } from 'lucide-react';
import Card from './ui/Card';

export default function PlatformStats() {
    const [stats, setStats] = useState({
        totalVolume: 0,
        activeMarkets: 0,
        totalPools: 0,
        isLoaded: false
    });

    useEffect(() => {
        async function fetchStats() {
            const volume = await getTotalVolume();
            const markets = await getMarkets('all');
            setStats({
                totalVolume: volume,
                activeMarkets: markets.filter(m => !m.settled).length,
                totalPools: markets.length,
                isLoaded: true
            });
        }
        fetchStats();
    }, []);

    if (!stats.isLoaded) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-card/20 animate-pulse rounded-2xl border border-border/50" />
                ))}
            </div>
        );
    }

    const items = [
        { label: 'Total Volume', value: `${stats.totalVolume.toLocaleString()} STX`, icon: Activity, color: 'text-primary' },
        { label: 'Active Markets', value: stats.activeMarkets, icon: Layers, color: 'text-accent' },
        { label: 'Total Pools', value: stats.totalPools, icon: BarChart3, color: 'text-purple-400' },
        { label: 'Community', value: '2.4k+', icon: Users, color: 'text-green-400' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {items.map((item, i) => (
                <Card key={i} className={`p-6 bg-card/40 backdrop-blur-xl border-white/5 hover:border-primary/30 transition-all group overflow-hidden relative animate-in fade-in zoom-in-95 duration-700 fill-mode-both`} style={{ animationDelay: `${i * 150}ms` }}>
                    <div className="flex items-center gap-5 relative z-10">
                        <div className={`p-4 rounded-2xl bg-primary/5 border border-primary/10 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500`}>
                            <item.icon className={`w-6 h-6 ${item.color} group-hover:animate-bounce`} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-muted-foreground/50 tracking-[0.2em] leading-none mb-2">{item.label}</p>
                            <p className="text-3xl font-black tracking-tighter tabular-nums">{item.value}</p>
                        </div>
                    </div>
                    {/* Visual flourish */}
                    <div className={`absolute -bottom-8 -right-8 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 ${item.color}`}>
                        <item.icon className="w-full h-full" />
                    </div>
                </Card>
            ))}
        </div>
    );
}

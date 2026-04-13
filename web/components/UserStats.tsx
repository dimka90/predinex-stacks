import { TrendingUp, Users, Activity, BarChart3, Trophy, Zap } from "lucide-react";
import { formatPoints } from "../lib/utils/formatters";
import UserTierBadge from "./UserTierBadge";
import { useMetrics } from "../lib/hooks/useMetrics";

interface StatItemProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    isLoading?: boolean;
}

function StatItem({ label, value, icon, trend, isLoading }: StatItemProps) {
    if (isLoading) return (
        <div className="flex flex-col gap-2 p-5 bg-card/10 backdrop-blur-md rounded-2xl border border-white/5 animate-pulse shadow-inner">
            <div className="h-2 w-12 bg-white/10 rounded mb-2" />
            <div className="h-8 w-24 bg-white/10 rounded" />
        </div>
    );
    const formattedValue = label.toLowerCase().includes('points') ? formatPoints(value) : value;
    return (
        <div className="flex flex-col gap-2 p-5 bg-black/20 backdrop-blur-xl rounded-2xl hover:bg-white/5 transition-all duration-500 border border-white/5 hover:border-primary/40 group relative overflow-hidden active:scale-95 shadow-inner hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">{label}</span>
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                    {icon}
                </div>
            </div>
            <div className="flex items-baseline gap-2 relative z-10 mt-1">
                <span className="text-3xl font-black tracking-tighter tabular-nums drop-shadow-sm">{formattedValue}</span>
                {trend && (
                    <div className="flex items-center gap-1 text-[9px] font-black tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
                        <Activity className="h-2 w-2" />
                        {trend}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function UserStats() {
    const { metrics, isLoading } = useMetrics();

    return (
        <div className="glass-panel rounded-2xl p-8 h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500" />

            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <BarChart3 className="h-5 w-5" />
                </div>
                Performance Metrics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <StatItem
                    label="Points Balance"
                    value={metrics.points || '0'}
                    icon={<Trophy className="h-4 w-4" />}
                    trend={Number(metrics.points) > 0 ? "+12%" : undefined}
                    isLoading={isLoading}
                />
                <StatItem
                    label="Rank"
                    value={metrics.rank}
                    icon={<Users className="h-4 w-4" />}
                    isLoading={isLoading}
                />
                <StatItem
                    label="Activity"
                    value={metrics.activity}
                    icon={<Activity className="h-4 w-4" />}
                    trend="+5%"
                    isLoading={isLoading}
                />
                <StatItem
                    label="Impact"
                    value={metrics.impact}
                    icon={<TrendingUp className="h-4 w-4" />}
                    isLoading={isLoading}
                />
                <StatItem
                    label="Staking Rewards"
                    value={metrics.stakingRewards}
                    icon={<Zap className="h-4 w-4" />}
                    trend="+8%"
                    isLoading={isLoading}
                />
            </div>

            {isLoading ? (
                <div className="h-32 w-full bg-muted/10 rounded-xl animate-pulse" />
            ) : (
                <UserTierBadge
                    tier={metrics.tier}
                    progress={metrics.progress}
                    pointsToNext={metrics.pointsToNext}
                    nextTier={metrics.nextTier}
                />
            )}
        </div>
    );
}

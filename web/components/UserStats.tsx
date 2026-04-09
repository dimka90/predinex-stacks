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
        <div className="flex flex-col gap-2 p-5 bg-muted/10 backdrop-blur-sm rounded-xl border border-border/50 animate-pulse">
            <div className="h-2 w-12 bg-muted rounded mb-2" />
            <div className="h-8 w-24 bg-muted rounded" />
        </div>
    );
    const formattedValue = label.toLowerCase().includes('points') ? formatPoints(value) : value;
    return (
        <div className="flex flex-col gap-2 p-5 bg-muted/10 backdrop-blur-sm rounded-xl hover:bg-muted/20 transition-all duration-300 border border-border/50 hover:border-primary/30 group">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight">{formattedValue}</span>
                {trend && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">
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

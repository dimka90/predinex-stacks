import { TrendingUp, Users, Activity, BarChart3, Trophy } from "lucide-react";
import { formatPoints } from "../lib/utils/formatters";
import UserTierBadge from "./UserTierBadge";

interface StatItemProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
}

function StatItem({ label, value, icon, trend }: StatItemProps) {
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
                    label="Total Points"
                    value="12450"
                    icon={<Trophy className="h-4 w-4" />}
                    trend="+12%"
                />
                <StatItem
                    label="Rank"
                    value="#42"
                    icon={<Users className="h-4 w-4" />}
                />
                <StatItem
                    label="Activity"
                    value="89%"
                    icon={<Activity className="h-4 w-4" />}
                    trend="+5%"
                />
                <StatItem
                    label="Impact"
                    value="High"
                    icon={<TrendingUp className="h-4 w-4" />}
                />
            </div>

            <UserTierBadge
                tier="Institutional Tier"
                progress={75}
                pointsToNext="2,550"
                nextTier="Whale Tier"
            />
        </div>
    );
}

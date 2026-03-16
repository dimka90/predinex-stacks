import { TrendingUp, Users, Activity, BarChart3 } from "lucide-react";

interface StatItemProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
}

function StatItem({ label, value, icon, trend }: StatItemProps) {
    return (
        <div className="flex flex-col gap-2 p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
                <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                    {icon}
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{value}</span>
                {trend && (
                    <span className="text-xs font-medium text-green-500">{trend}</span>
                )}
            </div>
        </div>
    );
}

export default function UserStats() {
    return (
        <div className="glass-panel rounded-xl p-6 h-full">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Performance Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <StatItem
                    label="Total Points"
                    value="12,450"
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
            <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm text-primary font-medium">Next Tier: Institutional</p>
                <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 text-right">2,550 pts to go</p>
            </div>
        </div>
    );
}

import { Trophy } from "lucide-react";

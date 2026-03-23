import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: LucideIcon;
    trend?: string;
    trendType?: 'up' | 'down' | 'neutral';
    description?: string;
    color?: 'primary' | 'accent' | 'success' | 'warning';
    chart?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    description,
    color = 'primary'
}) => {
    const colorMap = {
        primary: 'text-primary bg-primary/10 border-primary/20',
        accent: 'text-accent bg-accent/10 border-accent/20',
        success: 'text-green-500 bg-green-500/10 border-green-500/20',
        warning: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    };

    return (
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl -mr-12 -mt-12 opacity-20 group-hover:opacity-40 transition-opacity ${color === 'primary' ? 'bg-primary' : 'bg-accent'}`} />

            <div className={`p-3 w-fit rounded-xl border ${colorMap[color]} mb-4`}>
                {Icon ? <Icon size={20} /> : <div className="w-5 h-5" />}
            </div>

            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{title}</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black tracking-tighter">{value}</span>
                        {trend && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${trendType === 'up' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                    trendType === 'down' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                        'bg-muted/10 text-muted-foreground border-muted/20'
                                }`}>
                                {trend}
                            </span>
                        )}
                    </div>
                    {description && (
                        <p className="text-[10px] text-muted-foreground mt-2 font-medium">{description}</p>
                    )}
                </div>
                {chart && (
                    <div className="h-12 w-24 ml-4">
                        {chart}
                    </div>
                )}
            </div>
        </div>
    );
};

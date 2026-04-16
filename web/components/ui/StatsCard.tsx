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
    trendType,
    description,
    color = 'primary',
    chart
}) => {
    const colorMap = {
        primary: 'text-primary bg-primary/10 border-primary/20',
        accent: 'text-accent bg-accent/10 border-accent/20',
        success: 'text-green-500 bg-green-500/10 border-green-500/20',
        warning: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    };

    return (
        <div role="group" aria-label={`${title} Statistics`} className="glass-panel p-6 rounded-[2rem] relative overflow-hidden group hover:border-primary/40 transition-all duration-500 shadow-inner hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] bg-black/40 backdrop-blur-2xl">
            <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(79,70,229,0.1),transparent_70%)] opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity duration-700`} />
            <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] -mr-16 -mt-16 opacity-30 group-hover:opacity-60 transition-opacity duration-1000 ${color === 'primary' ? 'bg-primary' : color === 'success' ? 'bg-emerald-500' : 'bg-accent'}`} />

            <div className={`p-4 w-fit rounded-2xl border ${colorMap[color]} mb-6 shadow-inner relative z-10`}>
                {Icon ? <Icon size={20} className="drop-shadow-md" /> : <div className="w-5 h-5" />}
            </div>

            <div className="flex justify-between items-end relative z-10">
                <div>
                    <h3 className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-[0.3em] mb-2">{title}</h3>
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

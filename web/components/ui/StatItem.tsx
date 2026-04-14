import { ReactNode } from 'react';

interface StatItemProps {
    label: string;
    value: string | number;
    icon?: ReactNode;
    trend?: {
        value: string | number;
        isPositive: boolean;
    };
    className?: string;
}

/**
 * StatItem - Metric display component
 * @param label Metric name
 * @param value Metric value
 * @param icon Optional icon
 * @param trend Optional trend information (value, positivity)
 * @param className Additional CSS classes
 */
export default function StatItem({
    label,
    value,
    icon,
    trend,
    className = ''
}: StatItemProps) {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <span className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-[0.2em] flex items-center gap-2 group-hover:text-primary transition-colors duration-500 ease-out">
                <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-primary drop-shadow-[0_0_5px_rgba(79,70,229,0.5)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">{icon}</span>
                {label}
            </span>
            <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black tracking-tighter">{value}</span>
                {trend && (
                    <span className={`text-[10px] font-black uppercase tracking-widest ${trend.isPositive ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]' : 'text-rose-400 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]'}`}>
                        {trend.isPositive ? '+' : ''}{trend.value}
                    </span>
                )}
            </div>
        </div>
    );
}

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
        <div className={`flex flex-col gap-1 ${className}`}>
            <span className="text-[11px] uppercase font-black text-muted-foreground/50 tracking-[0.1em] flex items-center gap-2">
                <span className="p-1 rounded bg-primary/10 text-primary/80">{icon}</span>
                {label}
            </span>
            <div className="flex items-baseline gap-2">
                <span className="text-xl font-black tracking-tight">{value}</span>
                {trend && (
                    <span className={`text-[10px] font-bold ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trend.isPositive ? '+' : ''}{trend.value}
                    </span>
                )}
            </div>
        </div>
    );
}

import StatusBadge from './StatusBadge';

interface MarketCardHeaderProps {
    id: string | number;
    status: string;
    className?: string;
}

/**
 * MarketCardHeader - Unified header for market cards and list items.
 * Displays the pool ID and status badge.
 */
export default function MarketCardHeader({ id, status, className }: MarketCardHeaderProps) {
    return (
        <div className={`flex justify-between items-center mb-8 ${className || ''}`}>
            <StatusBadge status={status} />
            <span className="text-[9px] text-muted-foreground font-mono font-black uppercase tracking-widest bg-muted/20 px-2.5 py-1 rounded-lg border border-border/50">
                #POOL-{id}
            </span>
        </div>
    );
}

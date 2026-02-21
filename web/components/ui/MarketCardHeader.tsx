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
        <div className={`flex justify-between items-center mb-6 ${className || ''}`}>
            <StatusBadge status={status} />
            <span className="text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-tighter bg-muted/30 px-2 py-0.5 rounded">
                #POOL-{id}
            </span>
        </div>
    );
}

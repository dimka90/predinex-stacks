import StatusBadge from './StatusBadge';
import { CheckCircle2 } from 'lucide-react';

interface MarketCardHeaderProps {
    id: string | number;
    status: string;
    isVerified?: boolean;
    className?: string;
}

/**
 * MarketCardHeader - Unified header for market cards and list items.
 * Displays the pool ID and status badge.
 */
export default function MarketCardHeader({ id, status, isVerified, className }: MarketCardHeaderProps) {
    return (
        <div className={`flex justify-between items-center mb-8 ${className || ''}`}>
            <div className="flex items-center gap-2">
                <StatusBadge status={status} />
                {isVerified && (
                    <div className="p-1 bg-blue-500/10 rounded-full" title="Verified Market">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                )}
            </div>
            <span className="text-[9px] text-muted-foreground font-mono font-black uppercase tracking-widest bg-muted/20 px-2.5 py-1 rounded-lg border border-border/50">
                #POOL-{id}
            </span>
        </div>
    );
}

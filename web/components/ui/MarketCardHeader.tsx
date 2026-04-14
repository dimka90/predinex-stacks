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
        <div className={`flex justify-between items-center mb-6 relative z-10 ${className || ''}`}>
            <div className="flex items-center gap-3">
                <StatusBadge status={status} />
                {isVerified && (
                    <div className="p-2 md:p-1.5 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-inner group-hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-shadow" title="Verified Protocol Market">
                        <CheckCircle2 className="h-5 w-5 md:h-4 md:w-4 text-blue-500 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                )}
            </div>
            <span className="text-[10px] text-muted-foreground/60 font-mono font-black uppercase tracking-[0.2em] bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 shadow-inner">
                #POOL-{id}
            </span>

        </div>
    );
}

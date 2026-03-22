import { CheckCircle2 } from "lucide-react";
import { MarketStatus } from "../lib/types/market";

export interface FilterControlsProps {
    selectedStatus: string;
    onStatusChange: (status: MarketStatus | 'all') => void;
    counts: { [key: string]: number };
    isVerifiedOnly: boolean;
    onVerifiedChange: (verified: boolean) => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

export default function FilterControls({
    selectedStatus,
    onStatusChange,
    counts,
    isVerifiedOnly,
    onVerifiedChange,
    selectedCategory,
    onCategoryChange
}: FilterControlsProps) {
    const statuses = ['all', 'active', 'settled', 'expired'] as const;
    const categories = ['all', 'Sports', 'Politics', 'Crypto', 'Tech'];

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/30 p-6 rounded-3xl border border-border shadow-sm glass">
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2 bg-muted/30 p-1.5 rounded-xl w-fit border border-border/50">
                    {statuses.map(status => (
                        <button
                            key={status}
                            onClick={() => onStatusChange(status)}
                            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${selectedStatus === status
                                ? 'bg-background shadow-lg text-primary scale-105'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            <span className="ml-1.5 opacity-60 text-[10px]">{counts[status] || 0}</span>
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2">
                    {['All', ...categories].map(cat => (
                        <button
                            key={cat}
                            onClick={() => onCategoryChange(cat)}
                            className={`px-4 py-1.5 rounded-full border text-xs font-bold transition-all ${selectedCategory === cat
                                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]'
                                : 'border-border/50 bg-transparent text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => onVerifiedChange(!isVerifiedOnly)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all font-bold text-sm ${isVerifiedOnly
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                        : 'bg-muted/20 border-transparent text-muted-foreground hover:border-border'
                        }`}
                >
                    <CheckCircle2 className={`h-4 w-4 ${isVerifiedOnly ? 'animate-pulse' : ''}`} />
                    Verified Only
                </button>
            </div>
        </div>
    );
}

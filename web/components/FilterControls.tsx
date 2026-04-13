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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-card p-4 lg:p-6 mb-8 mt-2 relative z-10">
            <div className="flex flex-col xl:flex-row xl:items-center gap-6">
                <div className="flex flex-wrap gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-2xl w-fit border border-white/5 shadow-inner">
                    {statuses.map(status => (
                        <button
                            key={status}
                            onClick={() => onStatusChange(status)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedStatus === status
                                ? 'bg-primary shadow-[0_5px_15px_rgba(79,70,229,0.3)] text-white scale-[1.02] border border-white/10'
                                : 'text-muted-foreground/70 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            {status}
                            <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] ${selectedStatus === status ? 'bg-black/20 text-white' : 'bg-white/5 text-muted-foreground/50'}`}>{counts[status] || 0}</span>
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2">
                    {['All', ...categories].map(cat => (
                        <button
                            key={cat}
                            onClick={() => onCategoryChange(cat)}
                            className={`px-5 py-2 rounded-full border text-[10px] uppercase font-black tracking-[0.15em] transition-all ${selectedCategory === cat
                                ? 'bg-primary/20 border-primary/50 text-white shadow-[0_0_15px_rgba(79,70,229,0.2)]'
                                : 'border-white/5 bg-black/20 text-muted-foreground/50 hover:border-primary/30 hover:bg-primary/5 hover:text-primary backdrop-blur-sm'
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
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl border transition-all font-black text-xs uppercase tracking-widest ${isVerifiedOnly
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.15)] active:scale-95'
                        : 'bg-black/20 border-white/5 text-muted-foreground/50 hover:border-white/10 hover:bg-white/5 active:scale-95 backdrop-blur-sm'
                        }`}
                >
                    <CheckCircle2 className={`h-4 w-4 ${isVerifiedOnly ? 'animate-pulse drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'opacity-50'}`} />
                    Verified Markets
                </button>
            </div>
        </div>
    );
}

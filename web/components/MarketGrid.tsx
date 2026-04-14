import { Pool } from '../lib/stacks-api';
import MarketCard from './MarketCard';
import { Spinner } from './ui/spinner';
import { Search } from 'lucide-react';

interface Props {
    markets: Pool[];
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
    searchQuery?: string;
    hasFilters?: boolean;
}

export default function MarketGrid({ markets, isLoading, error, onRetry, hasFilters }: Props) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 bg-red-500/5 rounded-[2rem] border border-red-500/20 backdrop-blur-md shadow-[0_20px_50px_rgba(239,68,68,0.1)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.15),transparent_70%)] pointer-events-none" />
                <p className="text-red-400 mb-6 font-black uppercase tracking-widest text-sm relative z-10">{error}</p>
                <button
                    onClick={onRetry}
                    className="px-8 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black uppercase tracking-[0.2em] rounded-xl transition-colors border border-red-500/30 hover:border-red-500/50 active:scale-95 shadow-inner relative z-10"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (markets.length === 0) {
        return (
            <div className="text-center py-24 bg-black/20 backdrop-blur-xl rounded-[2rem] border border-white/5 animate-in fade-in zoom-in-95 duration-700 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none opacity-50" />
                <div className="w-20 h-20 bg-black/40 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-inner relative z-10">
                    <Search className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-black mb-3 tracking-tighter uppercase relative z-10">No protocol markets found</h3>
                <p className="text-muted-foreground/70 max-w-md mx-auto px-4 font-medium leading-relaxed relative z-10">
                    {hasFilters
                        ? "We couldn't locate any smart contracts matching your current filters. Adjust your parameters to discover active liquidity."
                        : "There are no prediction markets active on the network at the moment. Please await next epoch."}
                </p>
                {hasFilters && (
                    <button
                        onClick={onRetry}
                        className="mt-10 px-8 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-all duration-500 ease-out border border-primary/20 font-black uppercase tracking-[0.2em] text-xs hover:shadow-[0_0_20px_rgba(79,70,229,0.2)] active:scale-95 relative z-10"
                    >
                        Reset Protocol Filters
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {markets.map((market, index) => (
                <MarketCard key={market.id} market={market} index={index} />
            ))}
        </div>
    );
}
// MarketGrid supports virtualization for large datasets (TODO: react-virtual)

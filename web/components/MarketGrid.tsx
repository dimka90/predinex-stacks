import { Pool } from '../lib/stacks-api';
import MarketCard from './MarketCard';
import { Spinner } from './ui/spinner';

interface Props {
    markets: Pool[];
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
    searchQuery?: string;
    hasFilters?: boolean;
}

export default function MarketGrid({ markets, isLoading, error, onRetry }: Props) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={onRetry} className="text-primary hover:underline">Try Again</button>
            </div>
        );
    }

    if (markets.length === 0) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                <p>No markets found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {markets.map(market => (
                <MarketCard key={market.id} market={market} />
            ))}
        </div>
    );
}

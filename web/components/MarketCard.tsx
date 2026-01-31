import Link from 'next/link';
import { Pool } from '../lib/stacks-api';
import { TrendingUp, Clock } from 'lucide-react';

export default function MarketCard({ market }: { market: Pool }) {
    return (
        <Link href={`/markets/${market.id}`} className="group block h-full">
            <div className="p-6 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${market.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                        {market.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">#POOL-{market.id}</span>
                </div>
                
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{market.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">{market.description}</p>
                
                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground pt-4 border-t border-border">
                    <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{(market.totalA + market.totalB).toLocaleString()} STX Vol</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Block {market.expiry}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

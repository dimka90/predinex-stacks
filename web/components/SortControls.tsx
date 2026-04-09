interface Props {
    selectedSort: string;
    onSortChange: (sort: string) => void;
}

import { ChevronDown } from 'lucide-react';

export default function SortControls({ selectedSort, onSortChange }: Props) {
    return (
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/5 bg-card/40 hover:bg-card/60 transition-all focus-within:ring-2 focus-within:ring-primary/40 group">
            <select
                value={selectedSort}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full px-6 py-4 bg-transparent outline-none transition-all font-black text-xs uppercase tracking-[0.2em] appearance-none cursor-pointer pr-12 text-muted-foreground hover:text-white"
            >
                <option value="newest" className="bg-slate-900 border-none">Newest First</option>
                <option value="ending_soon" className="bg-slate-900">Ending Soon</option>
                <option value="highest_volume" className="bg-slate-900">Highest Volume</option>
                <option value="liquidity" className="bg-slate-900">Most Liquidity</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-primary transition-colors">
                <ChevronDown className="h-4 w-4" />
            </div>
        </div>
    );
}

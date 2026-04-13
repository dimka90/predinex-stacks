interface Props {
    selectedSort: string;
    onSortChange: (sort: string) => void;
}

import { ChevronDown } from 'lucide-react';

export default function SortControls({ selectedSort, onSortChange }: Props) {
    return (
        <div className="relative w-full overflow-hidden rounded-[1.25rem] border border-white/5 bg-black/20 backdrop-blur-md hover:bg-white/5 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/40 group shadow-inner">
            <select
                value={selectedSort}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full px-6 py-4 bg-transparent outline-none transition-all font-black text-xs uppercase tracking-[0.2em] appearance-none cursor-pointer pr-12 text-muted-foreground hover:text-white"
            >
                <option value="newest" className="bg-slate-900 font-bold">Newest First</option>
                <option value="ending_soon" className="bg-slate-900 font-bold">Ending Soon</option>
                <option value="highest_volume" className="bg-slate-900 font-bold">Highest Volume</option>
                <option value="liquidity" className="bg-slate-900 font-bold">Most Liquidity</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/50 group-hover:text-primary transition-colors duration-300 group-focus-within:rotate-180 group-focus-within:text-primary">
                <ChevronDown className="h-5 w-5" />
            </div>
        </div>
    );
}

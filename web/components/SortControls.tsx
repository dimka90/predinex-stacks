interface Props {
    selectedSort: string;
    onSortChange: (sort: string) => void;
}

export default function SortControls({ selectedSort, onSortChange }: Props) {
    return (
        <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-card/40 border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary/50 outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
        >
            <option value="newest">Newest First</option>
            <option value="ending_soon">Ending Soon</option>
            <option value="highest_volume">Highest Volume</option>
            <option value="liquidity">Most Liquidity</option>
        </select>
    );
}

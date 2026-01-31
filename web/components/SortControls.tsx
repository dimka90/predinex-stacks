interface Props {
    selectedSort: string;
    onSortChange: (sort: string) => void;
}

export default function SortControls({ selectedSort, onSortChange }: Props) {
    return (
        <select 
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary outline-none"
        >
            <option value="newest">Newest First</option>
            <option value="ending_soon">Ending Soon</option>
            <option value="highest_volume">Highest Volume</option>
            <option value="liquidity">Most Liquidity</option>
        </select>
    );
}

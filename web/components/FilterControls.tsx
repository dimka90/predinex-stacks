interface Props {
    selectedStatus: string;
    onStatusChange: (status: string) => void;
    counts: { [key: string]: number };
}

export default function FilterControls({ selectedStatus, onStatusChange, counts }: Props) {
    const statuses = ['all', 'active', 'settled', 'expired'];
    const categories = ['Sports', 'Politics', 'Crypto', 'Tech'];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2 bg-muted/50 p-1 rounded-lg w-fit">
                {statuses.map(status => (
                    <button
                        key={status}
                        onClick={() => onStatusChange(status)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${selectedStatus === status
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)} ({counts[status] || 0})
                    </button>
                ))}
            </div>

            <div className="flex gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className="px-3 py-1 rounded-full border border-border text-xs font-semibold hover:border-primary/50 transition-colors"
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}

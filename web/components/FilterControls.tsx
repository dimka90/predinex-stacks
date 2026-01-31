interface Props {
    selectedStatus: string;
    onStatusChange: (status: string) => void;
    counts: { [key: string]: number };
}

export default function FilterControls({ selectedStatus, onStatusChange, counts }: Props) {
    const statuses = ['all', 'active', 'settled', 'expired'];
    
    return (
        <div className="flex gap-2 bg-muted/50 p-1 rounded-lg w-fit">
            {statuses.map(status => (
                <button
                    key={status}
                    onClick={() => onStatusChange(status)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        selectedStatus === status 
                        ? 'bg-background shadow-sm text-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({counts[status] || 0})
                </button>
            ))}
        </div>
    );
}

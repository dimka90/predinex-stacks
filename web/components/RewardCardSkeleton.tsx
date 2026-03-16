export default function RewardCardSkeleton() {
    return (
        <div className="glass-panel p-6 rounded-xl animate-pulse">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-6 w-6 bg-muted rounded-full" />
                <div className="h-6 w-32 bg-muted rounded" />
            </div>
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="h-4 w-4 bg-muted rounded" />
                            <div className="h-10 w-10 rounded-full bg-muted" />
                            <div className="h-4 w-24 bg-muted rounded" />
                        </div>
                        <div className="h-4 w-16 bg-muted rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function RewardCardSkeleton() {
    return (
        <div className="glass-panel p-8 rounded-2xl animate-pulse relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-8 w-8 bg-muted rounded-lg shimmer" />
                <div className="h-8 w-48 bg-muted rounded-md shimmer" />
            </div>
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-muted/10 rounded-xl border border-transparent shadow-sm">
                        <div className="flex items-center gap-5">
                            <div className="h-5 w-5 bg-muted rounded shimmer" />
                            <div className="h-12 w-12 rounded-full bg-muted shimmer" />
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-muted rounded shimmer" />
                                <div className="h-3 w-20 bg-muted rounded shimmer opacity-50" />
                            </div>
                        </div>
                        <div className="h-6 w-20 bg-muted rounded-full shimmer" />
                    </div>
                ))}
            </div>
            <div className="absolute inset-0 pointer-events-none shimmer opacity-20" />
        </div>
    );
}

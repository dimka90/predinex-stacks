/**
 * MarketCardSkeleton - Loading placeholder for market cards.
 * Provides visual continuity while data is being fetched.
 */
export default function MarketCardSkeleton() {
    return (
        <div className="glass-panel p-8 animate-pulse">
            {/* Header skeleton */}
            <div className="flex justify-between items-center mb-6">
                <div className="h-4 w-16 bg-white/5 rounded-full" />
                <div className="h-4 w-12 bg-white/5 rounded-full" />
            </div>

            {/* Title skeleton */}
            <div className="space-y-2 mb-6">
                <div className="h-5 w-3/4 bg-white/5 rounded" />
                <div className="h-4 w-full bg-white/5 rounded" />
                <div className="h-4 w-2/3 bg-white/5 rounded" />
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                <div className="space-y-2">
                    <div className="h-3 w-12 bg-white/5 rounded" />
                    <div className="h-5 w-20 bg-white/5 rounded" />
                </div>
                <div className="space-y-2 items-end flex flex-col">
                    <div className="h-3 w-12 bg-white/5 rounded" />
                    <div className="h-5 w-16 bg-white/5 rounded" />
                </div>
            </div>

            {/* Button skeleton */}
            <div className="mt-8">
                <div className="h-10 w-full bg-white/5 rounded-xl" />
            </div>
        </div>
    );
}

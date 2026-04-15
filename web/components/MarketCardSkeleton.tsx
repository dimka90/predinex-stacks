export default function MarketCardSkeleton() {
    return (
        <div className="p-8 rounded-[2rem] border border-white/5 bg-black/20 backdrop-blur-md h-full flex flex-col relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

            {/* Status Badge Skeleton */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5 relative z-10">
                <div className="h-8 w-24 bg-white/5 rounded-xl shadow-inner" />
                <div className="h-6 w-20 bg-white/5 rounded-xl shadow-inner" />
            </div>

            {/* Title Skeleton */}
            <div className="relative z-10">
                <div className="h-8 bg-white/10 rounded-lg w-3/4 mb-3" />
                <div className="h-8 bg-white/10 rounded-lg w-1/2 mb-6" />
            </div>

            {/* Description Skeleton */}
            <div className="relative z-10">
                <div className="h-4 bg-white/5 rounded-md w-full mb-3" />
                <div className="h-4 bg-white/5 rounded-md w-5/6 mb-10" />
            </div>

            {/* Footer Skeleton */}
            <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="h-3 w-12 bg-white/5 rounded-md" />
                        <div className="h-6 w-28 bg-white/10 rounded-lg" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="h-3 w-12 bg-white/5 rounded-md" />
                        <div className="h-6 w-28 bg-white/10 rounded-lg" />
                    </div>
                </div>
                <div className="h-10 w-10 bg-white/10 rounded-2xl" />
            </div>
        </div>
    );
}

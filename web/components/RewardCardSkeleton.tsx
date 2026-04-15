export default function RewardCardSkeleton() {
    return (
        <div className="glass-card p-8 relative overflow-hidden animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
            <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="h-10 w-10 bg-slate-800/80 rounded-xl" />
                <div className="h-8 w-48 bg-slate-800/80 rounded-lg" />
            </div>
            <div className="space-y-4 relative z-10">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-black/40 backdrop-blur-md rounded-[1.25rem] border border-white/5 shadow-inner relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite] pointer-events-none" />
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="h-5 w-5 bg-white/10 rounded-md shadow-inner" />
                            <div className="h-12 w-12 rounded-full bg-slate-800/80" />
                            <div className="space-y-3">
                                <div className="h-4 w-32 bg-slate-800/80 rounded-md" />
                                <div className="h-3 w-20 bg-slate-800/80 rounded-md opacity-60" />
                            </div>
                        </div>
                        <div className="h-6 w-24 bg-slate-800/80 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

import React from 'react';

const AnalyticsOverview = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 relative z-10">
            <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <h3 className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] font-black mb-2 relative z-10">Total Volume</h3>
                <p className="text-3xl font-black text-white tabular-nums tracking-tighter relative z-10">1,245,670 <span className="text-sm text-primary ml-1">STX</span></p>
                <div className="mt-3 inline-block px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20 relative z-10 group-hover:shadow-[0_0_10px_rgba(52,211,153,0.3)] transition-shadow">
                    ↑ 12% from last week
                </div>
            </div>
            <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <h3 className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] font-black mb-2 relative z-10">Active Pools</h3>
                <p className="text-3xl font-black text-white tabular-nums tracking-tighter relative z-10">124</p>
                <div className="mt-3 inline-block px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20 relative z-10 group-hover:shadow-[0_0_10px_rgba(52,211,153,0.3)] transition-shadow">
                    ↑ 5 new today
                </div>
            </div>
            <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
                <h3 className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] font-black mb-2 relative z-10">Unique Bettors</h3>
                <p className="text-3xl font-black text-white tabular-nums tracking-tighter relative z-10">4,892</p>
                <div className="mt-3 inline-block px-2 py-1 bg-white/5 text-muted-foreground/70 text-xs font-bold rounded-lg border border-white/5 relative z-10">
                    Synced with chain
                </div>
            </div>
        </div>
    );
};

export default AnalyticsOverview;

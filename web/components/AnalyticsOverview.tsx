import React from 'react';

const AnalyticsOverview = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Total Volume</h3>
                <p className="text-2xl font-bold text-white">1,245,670 STX</p>
                <span className="text-emerald-400 text-xs font-medium">↑ 12% from last week</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Active Pools</h3>
                <p className="text-2xl font-bold text-white">124</p>
                <span className="text-emerald-400 text-xs font-medium">↑ 5 new today</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Unique Bettors</h3>
                <p className="text-2xl font-bold text-white">4,892</p>
                <span className="text-slate-500 text-xs font-medium">Synced with chain</span>
            </div>
        </div>
    );
};

export default AnalyticsOverview;

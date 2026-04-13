import { useState } from 'react';
import { Pool } from '../lib/stacks-api';
import { Zap } from 'lucide-react';

export default function BettingSection({ pool, poolId }: { pool: Pool, poolId: number }) {
    const [selectedOutcome, setSelectedOutcome] = useState<'A' | 'B' | null>(null);
    const [amount, setAmount] = useState('');

    return (
        <div className="bg-card/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-8">Place Institutional Bet</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                    onClick={() => setSelectedOutcome('A')}
                    className={`p-6 rounded-2xl font-black uppercase tracking-widest transition-all scale-100 active:scale-95 border-2 ${selectedOutcome === 'A' ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-background hover:bg-muted border-transparent hover:border-white/10'}`}
                >
                    {pool.outcomeA}
                </button>
                <button
                    onClick={() => setSelectedOutcome('B')}
                    className={`p-6 rounded-2xl font-black uppercase tracking-widest transition-all scale-100 active:scale-95 border-2 ${selectedOutcome === 'B' ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-background hover:bg-muted border-transparent hover:border-white/10'}`}
                >
                    {pool.outcomeB}
                </button>
            </div>

            <div className="mb-8">
                <div className="relative group/input">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-6 py-6 rounded-2xl bg-black/20 backdrop-blur-md border border-white/5 group-hover/input:border-white/10 focus:ring-4 focus:ring-primary/20 focus:border-primary focus:bg-primary/5 outline-none transition-all font-black text-3xl tabular-nums placeholder:text-muted-foreground/30 shadow-inner"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground tracking-[0.2em]">STX MIN.</span>
                </div>
            </div>

            <button className="w-full py-6 bg-gradient-to-r from-primary to-indigo-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.4)] border border-white/20 flex items-center justify-center gap-3 group relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10">CONFIRM TRANSACTION</span>
                <Zap className="w-5 h-5 fill-white group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all relative z-10" />
            </button>
        </div>
    );
}

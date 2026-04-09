import { useState } from 'react';
import { Pool } from '../lib/stacks-api';

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
                <div className="relative">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-6 py-6 rounded-2xl bg-background border border-border focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-black text-2xl tabular-nums placeholder:text-muted-foreground/30"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground tracking-widest">STX</span>
                </div>
            </div>

            <button className="w-full py-6 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/30 border border-primary-foreground/10 flex items-center justify-center gap-3 group">
                CONFIRM TRANSACTION
                <Zap className="w-4 h-4 fill-white group-hover:scale-125 transition-transform" />
            </button>
        </div>
    );
}

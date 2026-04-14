'use client';
import { useStacksAccount } from '../lib/hooks/useStacksAccount';

export function AccountDisplay() {
  const { address, balance, isConnected } = useStacksAccount();

  if (!isConnected) return null;

  return (
    <div className="flex items-center gap-6 p-5 glass-card relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-700 group hover:border-primary/20">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-700" />
      <div className="relative z-10">
        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-black mb-1">Address</p>
        <p className="font-mono text-sm tracking-tighter text-foreground group-hover:text-primary transition-colors">{address}</p>
      </div>
      <div className="relative z-10">
        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-black mb-1">Balance</p>
        <p className="font-black tabular-nums text-foreground">{balance} <span className="text-primary text-xs ml-0.5">STX</span></p>
      </div>
    </div>
  );
}

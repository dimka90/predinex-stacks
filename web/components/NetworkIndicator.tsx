'use client';
import { useNetwork } from '../lib/hooks/useNetwork';

export function NetworkIndicator() {
  const { networkName, isMainnet } = useNetwork();

  return (
    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border shadow-lg backdrop-blur-md transition-all ${isMainnet ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10 hover:bg-amber-500/20'
      }`}>
      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isMainnet ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'}`} />
      {networkName}
    </div>
  );
}

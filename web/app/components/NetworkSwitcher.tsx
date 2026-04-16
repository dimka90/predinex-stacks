'use client';

import { useAppKitNetwork, useAppKitAccount } from '@reown/appkit/react';
import { Globe, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { NetworkType } from '@/app/lib/wallet-service';
import { stacksNetworks } from '@/lib/appkit-config';

export function NetworkSwitcher() {
  const { switchNetwork, caipNetwork } = useAppKitNetwork();
  const { isConnected } = useAppKitAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isConnected) {
    return null;
  }

  const currentNetwork = caipNetwork?.name?.toLowerCase().includes('testnet') ? 'testnet' : 'mainnet';

  const handleNetworkSwitch = async (network: NetworkType) => {
    if (network === currentNetwork) return;

    setIsLoading(true);
    setError(null);

    try {
      const targetNetwork = network === 'mainnet' ? stacksNetworks.mainnet : stacksNetworks.testnet;
      // @ts-ignore - AppKit types handling
      await switchNetwork(targetNetwork);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network switch failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors shadow-inner focus-within:ring-2 focus-within:ring-primary/40 relative z-[100] group min-h-[44px]">
      <div className={`relative flex items-center justify-center w-6 h-6 rounded-full transition-colors duration-500 ease-out ${currentNetwork === 'mainnet' ? 'bg-primary/20 text-primary group-hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-amber-500/20 text-amber-500 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]'}`}>
        <Globe className="w-3.5 h-3.5 animate-[spin_10s_linear_infinite]" />
      </div>
      <div className="relative">
        <select
          value={currentNetwork}
          onChange={e => handleNetworkSwitch(e.target.value as NetworkType)}
          disabled={isLoading}
          className="appearance-none bg-transparent outline-none font-black text-[10px] uppercase tracking-widest text-white/80 hover:text-white cursor-pointer pr-5 h-full relative z-10 w-full disabled:opacity-50"
        >
          <option value="mainnet" className="bg-slate-900 text-white font-bold p-2">Mainnet</option>
          <option value="testnet" className="bg-slate-900 text-white font-bold p-2">Testnet</option>
        </select>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 group-hover:text-white transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center backdrop-blur-sm z-20">
          <svg className="w-4 h-4 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
      )}

      {error && (
        <div className="absolute top-full mt-2 right-0 flex items-center gap-1.5 text-red-400 text-[9px] uppercase tracking-widest font-black bg-red-500/10 px-3 py-2 rounded-xl border border-red-500/30 whitespace-nowrap shadow-[0_5px_15px_rgba(220,38,38,0.2)] animate-in fade-in slide-in-from-top-1 duration-300">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
}

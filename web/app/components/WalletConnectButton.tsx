'use client';

import { useWalletConnect } from '@/app/lib/hooks/useWalletConnect';
import { Wallet, Loader2, LogOut, ExternalLink } from 'lucide-react';
import { WalletService } from '@/app/lib/wallet-service';
import { useAppKit } from '@/lib/hooks/useAppKit';

export function WalletConnectButton() {
  const { session, isConnecting } = useWalletConnect();
  const { open } = useAppKit();

  if (session?.isConnected) {
    return (
      <div className="flex items-center gap-4 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer group">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/20">
          <Wallet className="w-4 h-4 text-primary" />
        </div>
        <div className="flex flex-col">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mainnet Account</p>
          <p className="font-mono text-xs font-bold">
            {WalletService.formatAddress(session.address)}
          </p>
        </div>
        <div className="ml-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
          <LogOut className="w-3.5 h-3.5 text-red-400 hover:text-red-500" />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => open()}
      disabled={isConnecting}
      className={`flex items-center gap-3 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none`}
    >
      {isConnecting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Wallet className="w-4 h-4" />
      )}
      {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
    </button>
  );
}

'use client';

import { useWalletConnect } from '@/app/lib/hooks/useWalletConnect';
import { Wallet } from 'lucide-react';
import { WalletService } from '@/app/lib/wallet-service';
import { useAppKit } from '@/lib/hooks/useAppKit';

export function WalletConnectButton() {
  const { session } = useWalletConnect();
  const { open } = useAppKit();

  if (session?.isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <p className="text-muted-foreground">Connected</p>
          <p className="font-mono text-xs">
            {WalletService.formatAddress(session.address)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg border border-primary/20 transition-colors"
    >
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </button>
  );
}

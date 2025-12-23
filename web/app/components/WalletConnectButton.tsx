'use client';

import { useWalletConnect } from '@/context/WalletConnectContext';
import { Wallet, LogOut } from 'lucide-react';
import { useState } from 'react';

export function WalletConnectButton() {
  const { session, isConnecting, error, connect, disconnect } = useWalletConnect();
  const [showError, setShowError] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
      setShowError(false);
    } catch (err) {
      setShowError(true);
    }
  };

  if (session?.isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <p className="text-muted-foreground">Connected</p>
          <p className="font-mono text-xs">{session.address.slice(0, 8)}...{session.address.slice(-6)}</p>
        </div>
        <button
          onClick={disconnect}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-2 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg border border-primary/20 transition-colors disabled:opacity-50"
      >
        <Wallet className="w-4 h-4" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
      {showError && error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}

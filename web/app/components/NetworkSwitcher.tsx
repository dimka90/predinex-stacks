'use client';

import { useWalletConnect } from '@/context/WalletConnectContext';
import { Globe, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { NetworkType } from '@/lib/wallet-service';

export function NetworkSwitcher() {
  const { session, switchNetwork } = useWalletConnect();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session?.isConnected) {
    return null;
  }

  const handleNetworkSwitch = async (network: NetworkType) => {
    if (network === session.network) return;

    setIsLoading(true);
    setError(null);

    try {
      await switchNetwork(network);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network switch failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
        <button
          onClick={() => handleNetworkSwitch('mainnet')}
          disabled={isLoading}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            session.network === 'mainnet'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-1">
            Mainnet
            {session.network === 'mainnet' && <Check className="w-3 h-3" />}
          </div>
        </button>
        <button
          onClick={() => handleNetworkSwitch('testnet')}
          disabled={isLoading}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            session.network === 'testnet'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-1">
            Testnet
            {session.network === 'testnet' && <Check className="w-3 h-3" />}
          </div>
        </button>
      </div>
      
      {error && (
        <div className="flex items-center gap-1 text-red-500 text-xs">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
}
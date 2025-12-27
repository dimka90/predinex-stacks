'use client';

import { useWalletConnect } from '@/context/WalletConnectContext';
import { Wallet, LogOut, ChevronDown, Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { WalletService } from '@/lib/wallet-service';

export function WalletConnectButton() {
  const { 
    session, 
    isConnecting, 
    error, 
    availableWallets, 
    connect, 
    disconnect, 
    refreshBalance 
  } = useWalletConnect();
  
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleConnect = async (walletType?: string) => {
    try {
      await connect(walletType);
      setShowError(false);
      setShowWalletOptions(false);
    } catch (err) {
      setShowError(true);
    }
  };

  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    try {
      await refreshBalance();
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (session?.isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <p className="text-muted-foreground">Connected via {session.walletType}</p>
          <p className="font-mono text-xs">
            {WalletService.formatAddress(session.address)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-muted-foreground">
              {WalletService.formatSTXAmount(session.balance)}
            </p>
            <button
              onClick={handleRefreshBalance}
              disabled={isRefreshing}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              title="Refresh balance"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
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
    <div className="relative">
      {availableWallets.length > 1 ? (
        <div className="relative">
          <button
            onClick={() => setShowWalletOptions(!showWalletOptions)}
            disabled={isConnecting}
            className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg border border-primary/20 transition-colors disabled:opacity-50"
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {showWalletOptions && (
            <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 min-w-full">
              {availableWallets.map((wallet) => (
                <button
                  key={wallet.type}
                  onClick={() => handleConnect(wallet.type)}
                  disabled={isConnecting}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg disabled:opacity-50"
                >
                  <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{wallet.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => handleConnect()}
          disabled={isConnecting || availableWallets.length === 0}
          className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg border border-primary/20 transition-colors disabled:opacity-50"
        >
          {isConnecting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wallet className="w-4 h-4" />
          )}
          {isConnecting 
            ? 'Connecting...' 
            : availableWallets.length === 0 
              ? 'No Wallet Found' 
              : 'Connect Wallet'
          }
        </button>
      )}
      
      {showError && error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
      
      {availableWallets.length === 0 && (
        <p className="text-muted-foreground text-xs mt-2">
          Please install a Stacks wallet (Hiro, Xverse, or Leather)
        </p>
      )}
    </div>
  );
}

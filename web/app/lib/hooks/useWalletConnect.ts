/**
 * Hook for WalletConnect integration
 * Adapted to use Reown AppKit directly
 */

'use client';

import { useAppKitAccount } from '@reown/appkit/react';
import { useMemo } from 'react';

export interface WalletContextType {
  session: {
    address: string;
    isConnected: boolean;
    balance?: number;
  } | null;
}

export function useWalletConnect(): WalletContextType {
  const { address, isConnected } = useAppKitAccount();
  
  const session = useMemo(() => {
    if (isConnected && address) {
      return { 
        address,
        isConnected: true,
        balance: 0 
      };
    }
    return null;
  }, [address, isConnected]);

  return { session };
}

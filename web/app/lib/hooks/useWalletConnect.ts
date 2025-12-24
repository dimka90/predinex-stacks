/**
 * Hook for WalletConnect integration
 * Challenge #3: Build on Stacks with WalletConnect
 */

'use client';

import { useContext } from 'react';
import { WalletConnectContext, WalletContextType } from '../context/WalletConnectContext';

export function useWalletConnect(): WalletContextType {
  const context = useContext(WalletConnectContext);
  if (!context) {
    throw new Error('useWalletConnect must be used within WalletConnectProvider');
  }
  return context;
}

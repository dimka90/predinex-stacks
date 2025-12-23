/**
 * WalletConnect Context
 * Challenge #3: Build on Stacks with WalletConnect
 * Manages wallet connection state and operations
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WALLETCONNECT_CONFIG } from '@/lib/walletconnect-config';

export interface WalletSession {
  address: string;
  publicKey: string;
  network: 'mainnet' | 'testnet';
  balance: number;
  isConnected: boolean;
}

export interface WalletContextType {
  session: WalletSession | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchNetwork: (network: 'mainnet' | 'testnet') => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (tx: any) => Promise<string>;
}

const WalletConnectContext = createContext<WalletContextType | undefined>(undefined);

export function WalletConnectProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<WalletSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load session from storage on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const stored = localStorage.getItem(WALLETCONNECT_CONFIG.storage.key);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Verify session is still valid
          if (parsed.address && parsed.publicKey) {
            setSession(parsed);
          }
        }
      } catch (err) {
        console.error('Failed to load session:', err);
      }
    };

    loadSession();
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // WalletConnect connection logic
      // This would integrate with actual WalletConnect SDK
      console.log('Connecting to WalletConnect...');

      // Mock session for now
      const mockSession: WalletSession = {
        address: 'SP...',
        publicKey: 'pk...',
        network: 'mainnet',
        balance: 0,
        isConnected: true,
      };

      setSession(mockSession);
      localStorage.setItem(
        WALLETCONNECT_CONFIG.storage.key,
        JSON.stringify(mockSession)
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      setError(message);
      console.error('Connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      setSession(null);
      localStorage.removeItem(WALLETCONNECT_CONFIG.storage.key);
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  }, []);

  const switchNetwork = useCallback(async (network: 'mainnet' | 'testnet') => {
    if (!session) throw new Error('No session');

    try {
      setSession(prev => prev ? { ...prev, network } : null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network switch failed';
      setError(message);
    }
  }, [session]);

  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!session) throw new Error('No session');

    try {
      // WalletConnect sign message logic
      console.log('Signing message:', message);
      return 'signature...';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signing failed';
      setError(message);
      throw err;
    }
  }, [session]);

  const sendTransaction = useCallback(async (tx: any): Promise<string> => {
    if (!session) throw new Error('No session');

    try {
      // WalletConnect send transaction logic
      console.log('Sending transaction:', tx);
      return 'txid...';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transaction failed';
      setError(message);
      throw err;
    }
  }, [session]);

  const value: WalletContextType = {
    session,
    isConnecting,
    error,
    connect,
    disconnect,
    switchNetwork,
    signMessage,
    sendTransaction,
  };

  return (
    <WalletConnectContext.Provider value={value}>
      {children}
    </WalletConnectContext.Provider>
  );
}

export function useWalletConnect() {
  const context = useContext(WalletConnectContext);
  if (!context) {
    throw new Error('useWalletConnect must be used within WalletConnectProvider');
  }
  return context;
}

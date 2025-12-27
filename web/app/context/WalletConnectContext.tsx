/**
 * WalletConnect Context
 * Enhanced Stacks wallet connection management
 * Manages wallet connection state and operations using @stacks/connect
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WalletService, WalletSession, TransactionPayload, WalletProvider, NetworkType } from '../lib/wallet-service';
import { SessionStorageService } from '../lib/session-storage';
import { fetchAccountStxBalance } from '@stacks/blockchain-api-client';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

export interface WalletContextType {
  session: WalletSession | null;
  isConnecting: boolean;
  error: string | null;
  availableWallets: WalletProvider[];
  connect: (walletType?: string) => Promise<void>;
  disconnect: () => Promise<void>;
  switchNetwork: (network: NetworkType) => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (tx: TransactionPayload) => Promise<string>;
  refreshBalance: () => Promise<void>;
}

const WalletConnectContext = createContext<WalletContextType | undefined>(undefined);

export { WalletConnectContext };

export function WalletConnectProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<WalletSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletService, setWalletService] = useState<WalletService | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletProvider[]>([]);

  // Initialize wallet service and load session on mount
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        const service = new WalletService('mainnet');
        setWalletService(service);
        
        // Get available wallets
        const wallets = service.getAvailableWallets();
        setAvailableWallets(wallets);

        // Try to restore session
        const storedSession = SessionStorageService.retrieveSession();
        if (storedSession && service.isSignedIn()) {
          // Validate the session is still active
          const userData = service.getUserData();
          if (userData && userData.profile?.stxAddress) {
            const restoredSession: WalletSession = {
              ...storedSession,
              address: userData.profile.stxAddress.mainnet || userData.profile.stxAddress.testnet,
              isConnected: true,
            };
            
            setSession(restoredSession);
            
            // Refresh balance
            await refreshBalanceForSession(restoredSession, service);
          } else {
            // Invalid session, clear it
            SessionStorageService.clearSession();
          }
        }
      } catch (err) {
        console.error('Failed to initialize wallet:', err);
        setError('Failed to initialize wallet connection');
      }
    };

    initializeWallet();
  }, []);

  const refreshBalanceForSession = async (sessionData: WalletSession, service: WalletService) => {
    try {
      const network = service.getCurrentNetwork() === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
      const balanceResponse = await fetchAccountStxBalance({
        url: network.coreApiUrl,
        principal: sessionData.address,
      });
      
      const updatedSession = {
        ...sessionData,
        balance: parseInt(balanceResponse.balance),
        lastActivity: new Date(),
      };
      
      setSession(updatedSession);
      SessionStorageService.storeSession(updatedSession);
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    }
  };

  const connect = useCallback(async (walletType?: string) => {
    if (!walletService) {
      setError('Wallet service not initialized');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      let selectedWallet: WalletProvider | undefined;
      
      if (walletType) {
        selectedWallet = availableWallets.find(w => w.type === walletType);
      } else {
        // Default to first available wallet (usually Hiro)
        selectedWallet = availableWallets[0];
      }

      if (!selectedWallet) {
        throw new Error('No compatible wallet found');
      }

      // Connect using the selected wallet
      const authData = await selectedWallet.connect();
      
      if (authData && authData.userSession) {
        const userData = authData.userSession.loadUserData();
        
        const newSession: WalletSession = {
          address: userData.profile?.stxAddress?.mainnet || userData.profile?.stxAddress?.testnet || '',
          publicKey: userData.publicKey || '',
          network: walletService.getCurrentNetwork(),
          balance: 0,
          isConnected: true,
          walletType: selectedWallet.type,
          connectedAt: new Date(),
          lastActivity: new Date(),
        };

        setSession(newSession);
        SessionStorageService.storeSession(newSession);
        
        // Fetch balance
        await refreshBalanceForSession(newSession, walletService);
      } else {
        throw new Error('Failed to get user data from wallet');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      setError(message);
      console.error('Connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [walletService, availableWallets]);

  const disconnect = useCallback(async () => {
    try {
      if (walletService) {
        walletService.signOut();
      }
      
      setSession(null);
      SessionStorageService.clearSession();
      setError(null);
    } catch (err) {
      console.error('Disconnect error:', err);
      setError('Failed to disconnect wallet');
    }
  }, [walletService]);

  const switchNetwork = useCallback(async (network: NetworkType) => {
    if (!session || !walletService) {
      throw new Error('No active session');
    }

    try {
      walletService.switchNetwork(network);
      
      const updatedSession = {
        ...session,
        network,
        lastActivity: new Date(),
      };
      
      setSession(updatedSession);
      SessionStorageService.storeSession(updatedSession);
      
      // Refresh balance for new network
      await refreshBalanceForSession(updatedSession, walletService);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network switch failed';
      setError(message);
      throw err;
    }
  }, [session, walletService]);

  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!session || !walletService) {
      throw new Error('No active session');
    }

    try {
      // This would integrate with wallet-specific message signing
      // For now, return a placeholder
      console.log('Signing message:', message);
      
      // Update activity
      if (session) {
        SessionStorageService.updateActivity(session);
      }
      
      return 'signature_placeholder';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signing failed';
      setError(message);
      throw err;
    }
  }, [session, walletService]);

  const sendTransaction = useCallback(async (tx: TransactionPayload): Promise<string> => {
    if (!session || !walletService) {
      throw new Error('No active session');
    }

    try {
      const txId = await walletService.sendTransaction(tx);
      
      // Update activity
      SessionStorageService.updateActivity(session);
      
      return txId;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transaction failed';
      setError(message);
      throw err;
    }
  }, [session, walletService]);

  const refreshBalance = useCallback(async () => {
    if (!session || !walletService) {
      return;
    }

    await refreshBalanceForSession(session, walletService);
  }, [session, walletService]);

  const value: WalletContextType = {
    session,
    isConnecting,
    error,
    availableWallets,
    connect,
    disconnect,
    switchNetwork,
    signMessage,
    sendTransaction,
    refreshBalance,
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

/**
 * Wallet Service
 * Enhanced wallet connection utilities for Stacks wallets
 */

import { AppConfig, UserSession, showConnect, FinishedAuthData } from '@stacks/connect';
import { StacksMainnet, StacksTestnet, StacksNetwork } from '@stacks/network';
import { ClarityValue } from '@stacks/transactions';

export type WalletType = 'hiro' | 'xverse' | 'leather' | 'unknown';
export type NetworkType = 'mainnet' | 'testnet';

export interface WalletProvider {
  name: string;
  type: WalletType;
  icon: string;
  isInstalled: () => boolean;
  connect: () => Promise<FinishedAuthData>;
}

export interface WalletSession {
  address: string;
  publicKey: string;
  network: NetworkType;
  balance: number;
  isConnected: boolean;
  walletType: WalletType;
  connectedAt: Date;
  lastActivity: Date;
}

export interface TransactionPayload {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  fee?: number;
  nonce?: number;
}

export class WalletService {
  private appConfig: AppConfig;
  private userSession: UserSession;
  private network: StacksNetwork;

  constructor(network: NetworkType = 'mainnet') {
    this.appConfig = new AppConfig(['store_write', 'publish_data']);
    this.userSession = new UserSession({ appConfig: this.appConfig });
    this.network = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
  }

  /**
   * Get available wallet providers
   */
  getAvailableWallets(): WalletProvider[] {
    const providers: WalletProvider[] = [
      {
        name: 'Hiro Wallet',
        type: 'hiro',
        icon: '/icons/hiro-wallet.svg',
        isInstalled: () => typeof window !== 'undefined' && !!window.HiroWalletProvider,
        connect: () => this.connectWithHiro()
      },
      {
        name: 'Xverse',
        type: 'xverse',
        icon: '/icons/xverse.svg',
        isInstalled: () => typeof window !== 'undefined' && !!window.XverseProviders,
        connect: () => this.connectWithXverse()
      },
      {
        name: 'Leather',
        type: 'leather',
        icon: '/icons/leather.svg',
        isInstalled: () => typeof window !== 'undefined' && !!window.LeatherProvider,
        connect: () => this.connectWithLeather()
      }
    ];

    return providers.filter(provider => provider.isInstalled());
  }

  /**
   * Connect with Hiro Wallet
   */
  private async connectWithHiro(): Promise<FinishedAuthData> {
    return new Promise((resolve, reject) => {
      showConnect({
        appDetails: {
          name: 'Predinex',
          icon: '/logo.png',
        },
        redirectTo: '/',
        onFinish: (authData: FinishedAuthData) => {
          resolve(authData);
        },
        onCancel: () => {
          reject(new Error('User cancelled connection'));
        },
        userSession: this.userSession,
      });
    });
  }

  /**
   * Connect with Xverse (placeholder - would use Xverse SDK)
   */
  private async connectWithXverse(): Promise<FinishedAuthData> {
    // This would integrate with Xverse's specific connection method
    throw new Error('Xverse integration not yet implemented');
  }

  /**
   * Connect with Leather (placeholder - would use Leather SDK)
   */
  private async connectWithLeather(): Promise<FinishedAuthData> {
    // This would integrate with Leather's specific connection method
    throw new Error('Leather integration not yet implemented');
  }

  /**
   * Check if user is signed in
   */
  isSignedIn(): boolean {
    return this.userSession.isUserSignedIn();
  }

  /**
   * Get user data if signed in
   */
  getUserData(): any {
    if (this.isSignedIn()) {
      return this.userSession.loadUserData();
    }
    return null;
  }

  /**
   * Sign out user
   */
  signOut(): void {
    this.userSession.signUserOut();
  }

  /**
   * Create and broadcast a contract call transaction
   */
  async sendTransaction(payload: TransactionPayload): Promise<string> {
    if (!this.isSignedIn()) {
      throw new Error('User not signed in');
    }

    const userData = this.getUserData();
    
    // Import TransactionService here to avoid circular dependency
    const { TransactionService } = await import('./transaction-service');
    const txService = new TransactionService(this.network);
    
    // Validate payload
    const validation = txService.validatePayload(payload);
    if (!validation.isValid) {
      throw new Error(`Invalid transaction: ${validation.errors.join(', ')}`);
    }

    try {
      const result = await txService.executeTransaction(payload, userData.appPrivateKey, {
        fee: payload.fee,
        nonce: payload.nonce,
      });
      
      return result.txId;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  /**
   * Switch network
   */
  switchNetwork(network: NetworkType): void {
    this.network = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
  }

  /**
   * Get current network
   */
  getCurrentNetwork(): NetworkType {
    return this.network instanceof StacksMainnet ? 'mainnet' : 'testnet';
  }

  /**
   * Format address for display (truncated)
   */
  static formatAddress(address: string): string {
    if (!address || address.length < 14) return address;
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  }

  /**
   * Format STX amount for display
   */
  static formatSTXAmount(microSTX: number): string {
    const stx = microSTX / 1000000;
    return `${stx.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 6 
    })} STX`;
  }
}

// Global wallet provider type declarations
declare global {
  interface Window {
    HiroWalletProvider?: any;
    XverseProviders?: any;
    LeatherProvider?: any;
  }
}
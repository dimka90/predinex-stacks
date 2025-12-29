/**
 * Wallet Connector - Unified interface for connecting different wallet types
 * Supports Leather, Xverse, and WalletConnect
 */

import { showConnect } from '@stacks/connect';
import { UserSession } from '@stacks/auth';
import { handleWalletError, WalletError } from './wallet-errors';

export type WalletType = 'leather' | 'xverse' | 'walletconnect';

export interface WalletConnectionOptions {
    walletType: WalletType;
    userSession: UserSession;
    onFinish?: (authData: any) => void;
    onCancel?: () => void;
}

/**
 * Connect to a specific wallet type
 */
export async function connectWallet(options: WalletConnectionOptions): Promise<void> {
    const { walletType, userSession, onFinish, onCancel } = options;

    try {
        switch (walletType) {
            case 'leather':
            case 'xverse':
                await connectExtensionWallet(walletType, userSession, onFinish, onCancel);
                break;
            case 'walletconnect':
                await connectWalletConnect(userSession, onFinish, onCancel);
                break;
            default:
                throw new Error(`Unsupported wallet type: ${walletType}`);
        }
    } catch (error) {
        console.error(`Error connecting to ${walletType}:`, error);
        const walletError = handleWalletError(error, walletType);
        throw walletError;
    }
}

/**
 * Connect to extension wallets (Leather or Xverse)
 */
async function connectExtensionWallet(
    walletType: 'leather' | 'xverse',
    userSession: UserSession,
    onFinish?: (authData: any) => void,
    onCancel?: () => void
): Promise<void> {
    await showConnect({
        appDetails: {
            name: 'Predinex',
            icon: typeof window !== 'undefined' ? window.location.origin + '/favicon.ico' : '',
        },
        redirectTo: '/',
        userSession,
        onFinish: async (authData) => {
            console.log(`${walletType} authentication finished:`, authData);
            if (onFinish) {
                onFinish(authData);
            }
        },
        onCancel: () => {
            console.log(`User cancelled ${walletType} connection`);
            if (onCancel) {
                onCancel();
            }
        },
    });
}

/**
 * Connect via WalletConnect (mobile wallets)
 * Uses Stacks Connect with WalletConnect protocol support
 */
async function connectWalletConnect(
    userSession: UserSession,
    onFinish?: (authData: any) => void,
    onCancel?: () => void
): Promise<void> {
    await showConnect({
        appDetails: {
            name: 'Predinex',
            icon: typeof window !== 'undefined' ? window.location.origin + '/favicon.ico' : '',
        },
        redirectTo: '/',
        userSession,
        // Enable WalletConnect for mobile wallet support
        connectVersion: '2',
        onFinish: async (authData) => {
            console.log('WalletConnect authentication finished:', authData);
            if (onFinish) {
                onFinish(authData);
            }
        },
        onCancel: () => {
            console.log('User cancelled WalletConnect connection');
            if (onCancel) {
                onCancel();
            }
        },
    });
}

/**
 * Check if a specific wallet extension is available
 */
export function isWalletAvailable(walletType: WalletType): boolean {
    if (typeof window === 'undefined') return false;

    switch (walletType) {
        case 'leather':
            return !!(window as any).LeatherProvider || !!(window as any).stacksProvider;
        case 'xverse':
            return !!(window as any).XverseProvider || !!(window as any).xverse;
        case 'walletconnect':
            return true; // WalletConnect is always available via QR
        default:
            return false;
    }
}


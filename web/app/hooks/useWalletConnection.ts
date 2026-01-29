/**
 * useWalletConnection - Custom hook for wallet connection status
 * Provides wallet availability and connection state
 */

import { useEffect, useState } from 'react';
import { isWalletAvailable, WalletType } from '../lib/wallet-connector';

export interface WalletConnectionStatus {
    leather: boolean;
    xverse: boolean;
    walletconnect: boolean;
    hasAnyWallet: boolean;
}

export function useWalletConnection(): WalletConnectionStatus {
    const [status, setStatus] = useState<WalletConnectionStatus>({
        leather: false,
        xverse: false,
        walletconnect: true,
        hasAnyWallet: true,
    });

    useEffect(() => {
        const checkWallets = () => {
            const leather = isWalletAvailable('leather');
            const xverse = isWalletAvailable('xverse');
            const walletconnect = isWalletAvailable('walletconnect');
            
            setStatus({
                leather,
                xverse,
                walletconnect,
                hasAnyWallet: leather || xverse || walletconnect,
            });
        };

        checkWallets();
        
        // Recheck periodically in case wallet extensions are installed
        const interval = setInterval(checkWallets, 2000);
        
        return () => clearInterval(interval);
    }, []);

    return status;
}


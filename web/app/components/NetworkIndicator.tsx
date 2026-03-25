'use client';

import { Wifi, WifiOff } from 'lucide-react';

interface NetworkIndicatorProps {
    network: 'mainnet' | 'testnet';
    isConnected?: boolean;
    className?: string;
}

export default function NetworkIndicator({ network, isConnected = true, className = '' }: NetworkIndicatorProps) {
    const isMainnet = network === 'mainnet';

    return (
        <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${isMainnet
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                } ${className}`}
            aria-label={`Connected to ${network}`}
        >
            {isConnected ? (
                <Wifi size={12} className={isMainnet ? 'text-green-400' : 'text-yellow-400'} />
            ) : (
                <WifiOff size={12} className="text-red-400" />
            )}
            <span>{isMainnet ? 'Mainnet' : 'Testnet'}</span>
            <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        </div>
    );
}

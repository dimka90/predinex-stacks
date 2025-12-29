'use client';

/**
 * WalletModal - Unified wallet connection modal
 * Supports multiple wallet options: Leather, Xverse, and WalletConnect
 */

import { X, Wallet, Smartphone } from 'lucide-react';
import { ReactNode } from 'react';

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectWallet: (walletType: 'leather' | 'xverse' | 'walletconnect') => void;
}

export default function WalletModal({ isOpen, onClose, onSelectWallet }: WalletModalProps) {
    if (!isOpen) return null;

    const wallets = [
        {
            id: 'leather' as const,
            name: 'Leather',
            description: 'Connect with Leather wallet extension',
            icon: Wallet,
        },
        {
            id: 'xverse' as const,
            name: 'Xverse',
            description: 'Connect with Xverse wallet extension',
            icon: Wallet,
        },
        {
            id: 'walletconnect' as const,
            name: 'WalletConnect',
            description: 'Connect with mobile wallet via QR code',
            icon: Smartphone,
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="glass border border-border rounded-2xl p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Connect Wallet</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-3">
                    {wallets.map((wallet) => {
                        const Icon = wallet.icon;
                        return (
                            <button
                                key={wallet.id}
                                onClick={() => {
                                    onSelectWallet(wallet.id);
                                    onClose();
                                }}
                                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                            >
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-semibold">{wallet.name}</div>
                                    <div className="text-sm text-muted-foreground">{wallet.description}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}


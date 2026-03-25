'use client';

import { AlertTriangle, CheckCircle, Loader2, ExternalLink } from 'lucide-react';

export type TxStatus = 'pending' | 'success' | 'error';

interface TransactionStatusProps {
    status: TxStatus;
    txId?: string;
    message?: string;
    className?: string;
}

const statusConfig = {
    pending: {
        icon: Loader2,
        label: 'Transaction Pending',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10 border-yellow-500/20',
        animate: 'animate-spin',
    },
    success: {
        icon: CheckCircle,
        label: 'Transaction Confirmed',
        color: 'text-green-400',
        bg: 'bg-green-500/10 border-green-500/20',
        animate: '',
    },
    error: {
        icon: AlertTriangle,
        label: 'Transaction Failed',
        color: 'text-red-400',
        bg: 'bg-red-500/10 border-red-500/20',
        animate: '',
    },
};

export default function TransactionStatus({ status, txId, message, className = '' }: TransactionStatusProps) {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${config.bg} ${className}`}>
            <Icon size={18} className={`${config.color} ${config.animate}`} />
            <div className="flex-1">
                <p className={`text-sm font-bold ${config.color}`}>{config.label}</p>
                {message && <p className="text-xs text-muted-foreground mt-0.5">{message}</p>}
            </div>
            {txId && (
                <a
                    href={`https://explorer.hiro.so/txid/${txId}?chain=mainnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                    View <ExternalLink size={10} />
                </a>
            )}
        </div>
    );
}

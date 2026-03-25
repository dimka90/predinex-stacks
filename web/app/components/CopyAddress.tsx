'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyAddressProps {
    address: string;
    truncateStart?: number;
    truncateEnd?: number;
    className?: string;
}

/**
 * CopyAddress - Displays a truncated address with one-click copy.
 */
export default function CopyAddress({
    address,
    truncateStart = 6,
    truncateEnd = 4,
    className = '',
}: CopyAddressProps) {
    const [copied, setCopied] = useState(false);

    const truncated = address.length > truncateStart + truncateEnd
        ? `${address.slice(0, truncateStart)}...${address.slice(-truncateEnd)}`
        : address;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = address;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-primary/20 transition-all font-mono text-sm ${className}`}
            title={`Copy: ${address}`}
        >
            <span className="text-muted-foreground">{copied ? 'Copied!' : truncated}</span>
            {copied ? (
                <Check size={12} className="text-green-400" />
            ) : (
                <Copy size={12} className="text-muted-foreground" />
            )}
        </button>
    );
}

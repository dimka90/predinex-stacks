'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface ShareMarketButtonProps {
    poolId: number;
    title: string;
    className?: string;
}

export default function ShareMarketButton({ poolId, title, className = "" }: ShareMarketButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const url = `${window.location.origin}/markets/${poolId}`;
        const shareData = {
            title: `Predinex Market: ${title}`,
            text: `Check out this prediction market on Predinex: ${title}`,
            url,
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error('Error sharing:', err);
                }
            }
        }

        // Fallback to copy
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`
        p-2 rounded-lg bg-muted/50 hover:bg-primary hover:text-white transition-all 
        flex items-center gap-2 group relative
        ${className}
      `}
            title="Share Market"
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4 text-green-400 group-hover:text-white" />
                    <span className="text-xs font-bold absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded shadow-lg border border-border animate-in fade-in slide-in-from-bottom-2 whitespace-nowrap">
                        Link Copied!
                    </span>
                </>
            ) : (
                <Share2 className="w-4 h-4" />
            )}
        </button>
    );
}

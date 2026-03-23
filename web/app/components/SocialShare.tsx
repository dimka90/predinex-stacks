'use client';

import React from 'react';
import { Share2, Twitter, MessageSquare, Link as LinkIcon, Check } from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';

interface SocialShareProps {
    title: string;
    url: string;
}

export default function SocialShare({ title, url }: SocialShareProps) {
    const { showToast } = useToast();
    const [copied, setCopied] = React.useState(false);

    const shareUrl = encodeURIComponent(url);
    const shareTitle = encodeURIComponent(`Check out this prediction market on @Predinex: ${title}`);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        showToast("Link copied to clipboard!", "success");
        setTimeout(() => setCopied(false), 2000);
    };

    const shares = [
        {
            name: 'Twitter',
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`,
            color: 'text-[#1DA1F2] hover:bg-[#1DA1F2]/10'
        },
        {
            name: 'Telegram',
            icon: MessageSquare,
            href: `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`,
            color: 'text-[#0088cc] hover:bg-[#0088cc]/10'
        }
    ];

    return (
        <div className="flex flex-col gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Amplify Position</span>
            <div className="flex items-center gap-3">
                {shares.map((share) => (
                    <a
                        key={share.name}
                        href={share.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-xl border border-white/5 bg-white/5 transition-all hover:-translate-y-1 ${share.color}`}
                        title={`Share on ${share.name}`}
                    >
                        <share.icon size={18} />
                    </a>
                ))}

                <button
                    onClick={handleCopy}
                    className="p-3 rounded-xl border border-white/5 bg-white/5 text-muted-foreground hover:text-white hover:border-white/10 transition-all hover:-translate-y-1 group"
                    title="Copy Link"
                >
                    {copied ? <Check size={18} className="text-green-500" /> : <LinkIcon size={18} className="group-hover:text-primary transition-colors" />}
                </button>
            </div>
        </div>
    );
}

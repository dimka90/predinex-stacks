'use client';

import { useAppKit } from '../lib/hooks/useAppKit';
import { Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AppKitButtonProps {
  className?: string;
  label?: string;
}

export default function AppKitButton({ className, label = 'Connect Wallet' }: AppKitButtonProps) {
  const { open, isConnected, address } = useAppKit();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className={`flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full border border-primary/20 transition-colors font-medium text-sm ${className}`}
        disabled
      >
        <Wallet className="w-4 h-4" />
        Loading...
      </button>
    );
  }

  return (
    <>
      {!isConnected ? (
        <button
          onClick={() => open()}
          className={`flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-6 py-4 md:px-8 md:py-3.5 rounded-[1.25rem] border border-white/20 shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_10px_40px_rgba(79,70,229,0.5)] transition-all font-black text-xs uppercase tracking-[0.2em] active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 group min-h-[48px] justify-center ${className}`}
        >
          <Wallet className="w-5 h-5 md:w-4 md:h-4 group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-500" />
          {label}
        </button>
      ) : (
        <div className="shadow-lg shadow-black/20 rounded-2xl overflow-hidden glass hover:border-primary/30 transition-colors border border-white/10 active:scale-95">
          <w3m-button />
        </div>
      )}
    </>
  );
}

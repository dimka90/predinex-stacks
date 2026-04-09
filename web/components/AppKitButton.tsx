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
          className={`flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl border-2 border-primary-foreground/10 shadow-2xl shadow-primary/30 transition-all font-black text-xs uppercase tracking-[0.2em] active:scale-[0.98] active:brightness-90 focus:outline-none focus:ring-4 focus:ring-primary/30 group ${className}`}
        >
          <Wallet className="w-4 h-4 group-hover:scale-110 transition-transform duration-500" />
          {label}
        </button>
      ) : (
        <w3m-button />
      )}
    </>
  );
}

import { useWalletConnection } from '../lib/hooks/useWalletConnection';
import { ReactNode } from 'react';
import { Lock } from 'lucide-react';
import AppKitButton from './AppKitButton';

/**
 * AuthGuard - Higher Order Component pattern for institutional gateway access.
 * Secures deep links and transaction panels unless a Stacks AppKit connection is present.
 * Implements 700ms cubic-bezier transition locking animations.
 *
 * @param {ReactNode} children - Authenticated content to render
 */
export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isConnected } = useWalletConnection();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-12 glass-card mx-auto max-w-lg mt-12 text-center relative overflow-hidden group animate-in fade-in zoom-in-95 duration-700 ease-out">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/10 blur-[80px] -mt-16 group-hover:bg-primary/30 transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
        <div className="p-5 bg-card/50 rounded-full border border-white/5 mb-8 shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <Lock className="w-8 h-8 text-primary/70" />
        </div>
        <h2 className="text-3xl font-black mb-4 tracking-tighter uppercase relative z-10">Terminal Locked</h2>
        <p className="text-muted-foreground/70 mb-10 font-medium tracking-tight relative z-10 max-w-[280px]">
          Authentication required. Connect your Stacks wallet to access institutional prediction markets.
        </p>
        <div className="relative z-10">
          <AppKitButton />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

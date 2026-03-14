import Link from 'next/link';
import { useWalletConnection } from '../lib/hooks/useWalletConnection';

export default function Navbar() {
  const { isConnected, connect } = useWalletConnection();

  return (
    <nav aria-label="Main navigation" className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl hover:text-primary transition-colors">Predinex</Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/markets" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Markets</Link>
          <Link href="/create" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Create</Link>
          <Link href="/rewards" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Rewards</Link>
          <button onClick={connect} className="px-5 py-2 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-primary/20">
            {isConnected ? 'Connected' : 'Connect'}
          </button>
        </div>

        {/* Mobile Menu Toggle (Simplified) */}
        <div className="md:hidden">
          <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
// Generic navigation bar for all pages

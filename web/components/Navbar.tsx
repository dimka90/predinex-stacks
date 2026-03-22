import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Rocket } from 'lucide-react';
import { useWalletConnection } from '../lib/hooks/useWalletConnection';
import { NAV_LINKS } from '../lib/constants/navigation';

export default function Navbar() {
  const { isConnected, connect } = useWalletConnection();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav aria-label="Main navigation" className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-black text-2xl hover:text-primary transition-all duration-300 group">
          <div className="p-1.5 bg-primary text-primary-foreground rounded-lg shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
            <Rocket className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/70">
            Predinex
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold text-muted-foreground hover:text-primary transition-all hover:-translate-y-0.5"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={connect}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 border border-primary/50"
          >
            {isConnected ? 'Connected' : 'Connect Wallet'}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 bg-muted/20 text-muted-foreground hover:text-primary rounded-xl transition-all border border-transparent hover:border-primary/20"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div className={`md:hidden absolute top-20 left-0 w-full bg-background/95 backdrop-blur-2xl border-b border-border transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col p-6 gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-bold p-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { connect(); setIsOpen(false); }}
            className="mt-2 w-full p-4 bg-primary text-primary-foreground rounded-xl font-black text-center shadow-lg shadow-primary/20"
          >
            {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </nav>
  );
}

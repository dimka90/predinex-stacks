import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Rocket } from 'lucide-react';
import { useWalletConnection } from '../lib/hooks/useWalletConnection';
import { NAV_LINKS } from '../lib/constants/navigation';

export default function Navbar() {
  const { isConnected, connect } = useWalletConnection();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav aria-label="Main navigation" className="sticky top-0 w-full z-50 bg-black/40 backdrop-blur-3xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="container mx-auto px-6 h-28 flex items-center justify-between relative">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <Link href="/" className="flex items-center gap-3 font-black text-2xl hover:text-primary transition-all duration-500 group relative z-10">
          <div className="p-2 bg-gradient-to-br from-primary via-indigo-500 to-purple-600 text-white rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] group-hover:rotate-[15deg] transition-all duration-500 border border-white/20">
            <Rocket className="h-5 w-5 drop-shadow-md" />
          </div>
          <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/70 tracking-widest uppercase">
            Predinex
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-12 items-center relative z-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 hover:text-white transition-all py-2 group/nav"
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary transition-all duration-500 group-hover/nav:w-full group-hover/nav:shadow-[0_0_10px_rgba(79,70,229,0.8)] rounded-full" />
            </Link>
          ))}
          <button
            onClick={connect}
            className="px-8 py-3.5 bg-gradient-to-r from-primary via-indigo-500 to-primary bg-[length:200%_auto] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] border border-white/20 hover:bg-[position:right_center]"
          >
            {isConnected ? 'Wallet Connected' : 'Connect Protocol'}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4 relative z-10">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            className="p-3 bg-white/5 text-muted-foreground hover:text-white rounded-xl transition-all border border-white/10 hover:border-primary/40 hover:shadow-[0_0_15px_rgba(79,70,229,0.2)] active:scale-95"
          >
            {isOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
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

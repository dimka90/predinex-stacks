import { Twitter, Github, MessageCircle, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 mt-auto bg-black/40 backdrop-blur-3xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-50 pointer-events-none" />
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-muted-foreground relative z-10">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] order-2 md:order-1 opacity-50">&copy; 2026 Predinex Institutional. Built on Stacks Blockchain.</p>
        <div className="flex items-center gap-8 order-1 md:order-2 bg-white/5 px-8 py-3 rounded-2xl border border-white/5 shadow-inner">
          <a href="#" className="hover:text-primary transition-all hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(79,70,229,0.8)] active:scale-90" aria-label="Twitter">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-primary transition-all hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(79,70,229,0.8)] active:scale-90" aria-label="Discord">
            <MessageCircle className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-primary transition-all hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(79,70,229,0.8)] active:scale-90" aria-label="GitHub">
            <Github className="w-5 h-5" />
          </a>
          <div className="w-[1px] h-6 bg-white/10 mx-2" />
          <a href="#" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] group" aria-label="Documentation">
            <FileText className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
            <span>Docs</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

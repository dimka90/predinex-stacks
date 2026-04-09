import { Twitter, Github, MessageCircle, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 mt-auto bg-slate-950/80 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-50" />
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-muted-foreground relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] order-2 md:order-1 opacity-50">&copy; 2026 Predinex Institutional. Built on Stacks Blockchain.</p>
        <div className="flex items-center gap-8 order-1 md:order-2">
          <a href="#" className="hover:text-primary transition-all hover:scale-110 active:scale-90" aria-label="Twitter">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-primary transition-all hover:scale-110 active:scale-90" aria-label="Discord">
            <MessageCircle className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-primary transition-all hover:scale-110 active:scale-90" aria-label="GitHub">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-primary transition-all" aria-label="Documentation">
            <FileText className="w-4 h-4" />
            <span>Docs</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

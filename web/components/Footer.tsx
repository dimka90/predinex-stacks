export default function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-auto bg-muted/20">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-muted-foreground">
        <p className="text-sm font-medium order-2 md:order-1 tracking-tight">&copy; 2026 Predinex Institutional. Built on Stacks.</p>
        <div className="flex items-center gap-6 order-1 md:order-2 opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-xs font-black uppercase tracking-widest cursor-pointer hover:text-primary">Twitter</span>
          <span className="text-xs font-black uppercase tracking-widest cursor-pointer hover:text-primary">Discord</span>
          <span className="text-xs font-black uppercase tracking-widest cursor-pointer hover:text-primary">Docs</span>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Github, Twitter, MessageCircle, ExternalLink } from "lucide-react";

const FOOTER_VERSION = "v2.1.0";

const socialLinks = [
    { name: "GitHub", href: "https://github.com/dimka90/predinex-stacks", icon: Github },
    { name: "Twitter", href: "https://twitter.com/predinex", icon: Twitter },
    { name: "Discord", href: "https://discord.gg/predinex", icon: MessageCircle },
];

const navLinks = [
    { name: "Markets", href: "/markets" },
    { name: "Create", href: "/create" },
    { name: "Rankings", href: "/rankings" },
    { name: "About", href: "/about" },
];

const legalLinks = [
    { name: "Terms", href: "/terms" },
    { name: "Privacy", href: "/privacy" },
    { name: "API Docs", href: "/docs" },
];

export default function Footer() {
    return (
        <footer className="py-16 border-t border-white/10 glass-panel !rounded-none !border-x-0 !border-b-0 relative overflow-hidden z-10 mt-auto">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] bg-primary/10 blur-[150px] pointer-events-none rounded-t-full mix-blend-screen" aria-hidden="true" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 group mb-4">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform text-white font-bold">P</div>
                            <span className="font-bold text-xl tracking-tight gradient-text">Predinex</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Institutional-grade decentralized prediction markets built on the Stacks blockchain.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Protocol</h4>
                        <div className="flex flex-col gap-3">
                            {navLinks.map((link) => (
                                <Link key={link.name} href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Resources</h4>
                        <div className="flex flex-col gap-3">
                            {legalLinks.map((link) => (
                                <Link key={link.name} href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Community</h4>
                        <div className="flex gap-3">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/10 transition-all"
                                    aria-label={link.name}
                                >
                                    <link.icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} Predinex Protocol. Built on Stacks. {FOOTER_VERSION}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span>Mainnet Operational</span>
                        <ExternalLink size={10} className="ml-1 opacity-50" />
                    </div>
                </div>
            </div>
        </footer>
    );
}

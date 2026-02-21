import { Github, Twitter, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="glass border-t border-border py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                                <span className="font-bold text-white text-xs">P</span>
                            </div>
                            <span className="font-bold text-lg tracking-tight">Predinex</span>
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            Decentralized prediction markets on Stacks. Predict world events, engage with the community, and win rewards.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Protocol</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/markets" className="hover:text-primary transition-all hover:translate-x-1 inline-block">Markets</Link></li>
                            <li><Link href="/create" className="hover:text-primary transition-all hover:translate-x-1 inline-block">Create Pool</Link></li>
                            <li><Link href="/governance" className="hover:text-primary transition-all hover:translate-x-1 inline-block">Governance</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Community</h4>
                        <div className="flex gap-4">
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-muted/50 rounded-lg hover:bg-primary/20 hover:text-primary transition-all">
                                <Twitter size={18} />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-muted/50 rounded-lg hover:bg-primary/20 hover:text-primary transition-all">
                                <Github size={18} />
                            </a>
                            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-muted/50 rounded-lg hover:bg-primary/20 hover:text-primary transition-all">
                                <MessageSquare size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© 2026 Predinex Protocol. Built on Stacks.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

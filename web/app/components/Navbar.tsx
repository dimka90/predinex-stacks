'use client';

import { useState } from "react";
import Link from "next/link";
import { LogOut, Menu, X, Wallet, Sun, Moon, Bell } from "lucide-react";
import AppKitButton from "../../components/AppKitButton";
import { useStacks } from "./StacksProvider";
import DarkModeToggle from "./ui/DarkModeToggle";
import LanguageSelector from "./ui/LanguageSelector";
import { truncateAddress } from "../lib/utils";
import { ICON_CLASS } from "../lib/constants";

export default function Navbar() {
    const { userData, signOut, copyAddress } = useStacks();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState(3); // Mock notifications
    const stxAddress = userData?.profile?.stxAddress?.mainnet || userData?.profile?.stxAddress?.testnet || userData?.identityAddress;
    const [copied, setCopied] = useState(false);

    const handleCopyAddress = async () => {
        if (stxAddress) {
            await copyAddress();
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 glass-panel !rounded-none !border-x-0 !border-t-0 border-b border-white/10 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group" aria-label="Predinex Home">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="font-bold text-white">P</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gradient">Predinex</span>
                    </Link>
                    {/* Navigation Links - Desktop */}
                    <div className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Desktop navigation">
                        <Link href="/markets" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors tracking-widest uppercase" aria-label="View all markets">
                            Markets
                        </Link>
                        <Link href="/activity" className="relative group text-sm font-bold text-muted-foreground hover:text-primary transition-colors tracking-widest uppercase" aria-label="View activity feed">
                            Activity
                            {notifications > 0 && (
                                <span className="absolute -top-1 -right-2 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                            )}
                        </Link>
                        <Link href="/rankings" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors tracking-widest uppercase" aria-label="View rankings">
                            Rankings
                        </Link>
                        <Link href="/about" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors tracking-widest uppercase" aria-label="About Predinex">
                            About
                        </Link>
                    </div>

                    {/* User Info & Connect Button - Desktop */}
                    <div className="hidden md:flex items-center gap-4">
                        <LanguageSelector />
                        <DarkModeToggle />
                        {userData ? (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleCopyAddress}
                                    className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-border hover:bg-muted transition-colors group relative"
                                    title="Copy address"
                                >
                                    <Wallet className={ICON_CLASS.sm + " text-primary"} />
                                    <span className="text-sm font-mono font-medium">
                                        {copied ? 'Copied!' : (stxAddress ? truncateAddress(stxAddress) : 'Connected')}
                                    </span>
                                </button>
                                <button
                                    onClick={signOut}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full border border-red-500/20 transition-all hover:scale-110 active:scale-95"
                                    aria-label="Sign out"
                                    title="Sign out"
                                >
                                    <LogOut className={ICON_CLASS.sm} />
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Notifications */}
                                <button className="relative p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <Bell size={18} />
                                    {notifications > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                                    )}
                                </button>
                                <AppKitButton />
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <DarkModeToggle />
                        <AppKitButton />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-expanded={isMenuOpen}
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Backdrop */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[-1] md:hidden animate-in fade-in duration-300"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Content */}
            {isMenuOpen && (
                <div className="md:hidden glass-panel border-t border-white/5 animate-in slide-in-from-top-4 duration-300">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        <Link
                            href="/markets"
                            className="block px-4 py-3 text-sm font-black uppercase tracking-widest hover:bg-white/5 rounded-xl transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Markets
                        </Link>
                        <Link
                            href="/activity"
                            className="block px-4 py-3 text-sm font-black uppercase tracking-widest hover:bg-white/5 rounded-xl transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Activity
                        </Link>
                        <Link
                            href="/rankings"
                            className="block px-4 py-3 text-sm font-black uppercase tracking-widest hover:bg-white/5 rounded-xl transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Rankings
                        </Link>
                        <Link
                            href="/about"
                            className="block px-4 py-3 text-sm font-black uppercase tracking-widest hover:bg-white/5 rounded-xl transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>

                        {userData && (
                            <div className="pt-4 border-t border-white/5 space-y-2">
                                <button
                                    onClick={() => {
                                        signOut();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                                >
                                    Sign Out
                                    <LogOut size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

'use client';

import Navbar from "../components/Navbar";
import { Rocket, ShieldAtSign, Zap, Globe, Cpu, Coins } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                {/* Hero Section */}
                <div className="relative mb-24 text-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10" />
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
                        Predicting the Future.<br />Secured by Bitcoin.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Predinex is the leading decentralized prediction market on Stacks,
                        bridging the wisdom of crowds with the security of the world's most robust blockchain.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all duration-500">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 border border-primary/20">
                            <ShieldAtSign size={28} />
                        </div>
                        <h3 className="text-2xl font-black mb-4 tracking-tight">Bitcoin Security</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Every transaction is finalized on the Stacks layer, inheriting
                            the unparalleled security and decentralization of Bitcoin.
                        </p>
                    </div>
                    <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all duration-500">
                        <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-8 border border-accent/20">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-2xl font-black mb-4 tracking-tight">Fast Settlements</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Our optimized Clarity smart contracts ensure rapid pool resolution
                            and low-latency betting cycles for a seamless experience.
                        </p>
                    </div>
                    <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all duration-500">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 border border-primary/20">
                            <Globe size={28} />
                        </div>
                        <h3 className="text-2xl font-black mb-4 tracking-tight">Global Access</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Permissionless and borderless. Create and participate in markets
                            on anything, from anywhere, without intermediaries.
                        </p>
                    </div>
                </div>

                {/* Mission Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32 p-12 glass-panel rounded-[3rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                    <div>
                        <span className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-6 block underline decoration-4 underline-offset-8">Our Mission</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">The Oracle of Truth</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            We believe that markets are the most efficient tool for aggregating information.
                            Predinex exists to provide a transparent, immutable, and censorship-resistant
                            platform where collective intelligence is incentivized and rewarded.
                        </p>
                        <div className="flex gap-10">
                            <div>
                                <div className="text-3xl font-black mb-1">$2.4M+</div>
                                <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Locked TVL</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black mb-1">45k+</div>
                                <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Bets Placed</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4 pt-12">
                            <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex flex-col items-center justify-center text-primary">
                                <Cpu size={48} />
                                <span className="mt-4 font-bold text-sm">Automated</span>
                            </div>
                            <div className="aspect-square rounded-[2rem] bg-muted/30 border border-white/5" />
                        </div>
                        <div className="space-y-4">
                            <div className="aspect-square rounded-[2rem] bg-muted/30 border border-white/5" />
                            <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex flex-col items-center justify-center text-accent">
                                <Coins size={48} />
                                <span className="mt-4 font-bold text-sm">Incentivized</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

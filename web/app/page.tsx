'use client';

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { TrendingUp, Clock, BarChart3, Zap, ArrowRight, Shield } from "lucide-react";
import MarketCardHeader from "../components/ui/MarketCardHeader";
import ActivityFeed from "./components/ActivityFeed";
import { useActivities } from "./lib/hooks/useActivities";
import { useStacks } from "./components/StacksProvider";

export default function Home() {
  const { userData } = useStacks();
  const { activities, isLoading, error, refresh } = useActivities(3);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 transition-colors duration-1000">
      <Navbar />
      <Hero />

      {/* Featured Institutional Markets */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-[1px] bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">High Liquidity Channels</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase leading-[0.9]">
              Verified <br /> <span className="text-white opacity-40 italic">Markets</span>
            </h2>
            <p className="text-muted-foreground font-bold max-w-md leading-loose tracking-wide text-xs uppercase opacity-70">
              Institutional-grade pools with automated settlement triggers. Analyze risk-reward parity and execute secure positions.
            </p>
          </div>
          <a
            href="/markets"
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-primary transition-colors bg-white/5 px-8 py-4 rounded-full border border-white/5 backdrop-blur-xl"
          >
            Explore Terminal Base
            <TrendingUp size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            { id: 1, title: "Bitcoin vs Ethereum: 2026?", desc: "Will Bitcoin flip Ethereum before 2026 ends?", vol: "2,400 STX", time: "24h 10m", trend: "+12%" },
            { id: 2, title: "Stacks SBP/SIP-021 Success", desc: "Will the next Stacks upgrade be finalized by Q3?", vol: "1,850 STX", time: "12d 4h", trend: "+5%" },
            { id: 3, title: "BTC Price: $150k Reach", desc: "Will Bitcoin touch $150,000 in the current year?", vol: "5,120 STX", time: "45d 1h", trend: "+24%" }
          ].map((market) => (
            <div key={market.id} className="glass-panel p-10 cursor-pointer group hover:bg-zinc-950/80 hover:border-primary/40 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                <BarChart3 size={60} />
              </div>

              <div className="mb-8">
                <MarketCardHeader id={market.id} status="Active" />
              </div>

              <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors leading-tight uppercase tracking-tight">
                {market.title}
              </h3>
              <p className="text-[11px] font-bold text-muted-foreground mb-10 line-clamp-2 leading-relaxed uppercase tracking-wider opacity-60 italic">
                {market.desc}
              </p>

              <div className="grid grid-cols-2 gap-6 pt-10 border-t border-white/5">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-muted-foreground opacity-50">
                    <BarChart3 size={14} />
                    <span className="text-[9px] uppercase font-black tracking-widest">Protocol Vol</span>
                  </div>
                  <span className="font-black text-xl tracking-tighter">{market.vol}</span>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <div className="flex items-center gap-2 text-muted-foreground opacity-50">
                    <Clock size={14} />
                    <span className="text-[9px] uppercase font-black tracking-widest">Anchoring In</span>
                  </div>
                  <span className="font-black text-xl text-accent tracking-tighter">{market.time}</span>
                </div>
              </div>

              <div className="mt-10">
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                  Initialize Position
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Activity Integration */}
        {userData && (
          <div className="mt-40 p-12 glass-panel relative overflow-hidden bg-zinc-950/40">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-4">
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 w-fit text-primary mb-8 shadow-inner animate-pulse-glow">
                  <Zap size={28} />
                </div>
                <h2 className="text-4xl font-black mb-6 uppercase tracking-tight">Live Intelligence</h2>
                <p className="text-muted-foreground font-bold uppercase text-[10px] leading-loose tracking-widest opacity-70 italic mb-10">
                  Real-time protocol interactions. Tracking institutional activity across Army Divisions A, B, and C.
                </p>
                <div className="flex items-center gap-6 p-6 bg-black/40 rounded-[2rem] border border-white/5 shadow-inner">
                  <div className="w-12 h-12 rounded-full border-2 border-primary/40 bg-zinc-900 flex items-center justify-center text-primary">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">Active Liquidity</span>
                    <span className="text-xl font-black">285 Validated Nodes</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-8 backdrop-blur-3xl p-1 bg-white/5 rounded-[2.5rem]">
                <div className="p-10">
                  <ActivityFeed
                    activities={activities}
                    isLoading={isLoading}
                    error={error}
                    onRefresh={refresh}
                    limit={3}
                    showHeader={false}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Institutional CTA */}
        <div className="text-center mt-32 p-16 glass-panel relative overflow-hidden bg-accent/5 border-accent/10">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
          <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter italic">Bespoke Market Initialization</h3>
          <p className="text-muted-foreground font-bold mb-12 max-w-2xl mx-auto uppercase text-[10px] tracking-[0.2em] opacity-70 leading-relaxed">
            Deploy custom prediction pools with trustless resolution. Leverage the Predinex V2 architecture for secure event hedging.
          </p>
          <a
            href="/create"
            className="px-12 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.3em] rounded-full hover:bg-primary hover:text-white transition-all hover:scale-105 active:scale-95 shadow-2xl"
          >
            Create Sovereign Market
          </a>
        </div>
      </section>

      {/* Global Branding Decoration */}
      <div className="fixed bottom-12 left-12 opacity-10 pointer-events-none z-0">
        <Shield size={200} />
      </div>
    </main>
  );
}

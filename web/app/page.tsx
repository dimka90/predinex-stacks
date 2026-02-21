import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { TrendingUp, Clock, BarChart3 } from "lucide-react";
import MarketCardHeader from "../components/ui/MarketCardHeader";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 animate-in fade-in duration-700">
      <Navbar />
      <Hero />

      {/* Featured Pools */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">Featured Markets</h2>
            <p className="text-muted-foreground max-w-lg">
              The most active prediction markets on the protocol. Analyze the data and place your bets.
            </p>
          </div>
          <a
            href="/markets"
            className="group flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            View All Markets
            <TrendingUp size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { id: 1, title: "Bitcoin vs Ethereum: 2026?", desc: "Will Bitcoin flip Ethereum before 2026 ends?", vol: "2,400 STX", time: "24h 10m" },
            { id: 2, title: "Stacks SBP/SIP-021 Success", desc: "Will the next Stacks upgrade be finalized by Q3?", vol: "1,850 STX", time: "12d 4h" },
            { id: 3, title: "BTC Price: $150k Reach", desc: "Will Bitcoin touch $150,000 in the current year?", vol: "5,120 STX", time: "45d 1h" }
          ].map((market) => (
            <div key={market.id} className="glass p-8 rounded-2xl border border-border/50 hover:border-primary/40 transition-all cursor-pointer group hover:shadow-2xl hover:shadow-primary/5">
              <MarketCardHeader id={market.id} status="Active" />

              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                {market.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-8 line-clamp-2 leading-relaxed">
                {market.desc}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/50">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <BarChart3 size={14} />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Volume</span>
                  </div>
                  <span className="font-bold text-lg">{market.vol}</span>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock size={14} />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Ends In</span>
                  </div>
                  <span className="font-bold text-lg text-accent">{market.time}</span>
                </div>
              </div>

              <div className="mt-8">
                <button className="w-full py-3 bg-muted/50 hover:bg-primary hover:text-white transition-all rounded-xl font-bold text-sm">
                  Place Bet
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20 p-12 bg-gradient-to-b from-transparent to-muted/20 rounded-3xl border border-border/30">
          <h3 className="text-2xl font-bold mb-4">Don't see a market you're looking for?</h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            You can create your own prediction market on any event using our community-driven protocol.
          </p>
          <a
            href="/create"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white 
                     rounded-xl hover:bg-primary/90 transition-all font-bold hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
          >
            Create Your Own Market
          </a>
        </div>
      </section>
    </main>
  );
}

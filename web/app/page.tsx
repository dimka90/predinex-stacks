import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Navbar />
      <Hero />

      {/* Featured Pools (Mock for now) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Markets</h2>
          <a 
            href="/markets" 
            className="text-primary hover:text-primary/80 transition-colors font-medium"
          >
            View All Markets →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass p-6 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-muted-foreground">#POOL-{i}</span>
                <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-xs font-medium">Active</span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Bitcoin vs Ethereum: 2026?</h3>
              <p className="text-sm text-muted-foreground mb-6">Will Bitcoin flip Ethereum before 2026 ends?</p>

              <div className="flex justify-between items-center text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Volume</span>
                  <span className="font-semibold">2,400 STX</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-muted-foreground">Ends In</span>
                  <span className="font-semibold text-accent">24h 10m</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-12">
          <a 
            href="/markets"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground 
                     rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Explore All Markets
          </a>
        </div>
      </section>
    </main>
  );
}

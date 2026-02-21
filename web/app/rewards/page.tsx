'use client';

import Navbar from "../../components/Navbar";
import AuthGuard from "../../components/AuthGuard";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/ui/accordion";
import { Info } from "lucide-react";
import Leaderboard from "../../components/Leaderboard";

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <AuthGuard>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="glass-panel p-8 rounded-2xl mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Rewards</h1>
            <p className="text-muted-foreground">Track your performance and earnings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <Leaderboard />
            </div>
            <div className="lg:col-span-1">
              <div className="glass-panel p-6 rounded-xl h-full flex flex-col justify-center items-center text-center">
                <h2 className="text-lg font-medium text-muted-foreground mb-2">Your Rank</h2>
                <div className="text-5xl font-bold text-primary mb-2">#42</div>
                <p className="text-sm text-muted-foreground">Top 5% of contributors</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="calculation" className="border-border">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    How are rewards calculated?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground space-y-4">
                  <p>Rewards are based on your leaderboard position, which is determined by your activity across:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>The activity and impact of the smart contracts you've deployed on Stacks</li>
                    <li>Use of <code className="bg-muted px-1 py-0.5 rounded text-foreground">@stacks/connect</code> and <code className="bg-muted px-1 py-0.5 rounded text-foreground">@stacks/transactions</code> in your repos</li>
                    <li>GitHub contributions to public repositories</li>
                  </ul>
                  {/* Points will be added here */}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </AuthGuard>
    </main>
  );
}

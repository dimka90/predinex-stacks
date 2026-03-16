'use client';

import Navbar from "../../components/Navbar";
import AuthGuard from "../../components/AuthGuard";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/ui/accordion";
import { Info } from "lucide-react";
import UserStats from "../../components/UserStats";
import Leaderboard from "../../components/Leaderboard";
import CampaignRules from "../../components/CampaignRules";
import ModuleErrorBoundary from "../../components/ModuleErrorBoundary";

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <AuthGuard>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1 glass-panel p-8 rounded-2xl flex flex-col justify-center">
              <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Rewards</h1>
              <p className="text-muted-foreground">Monitor your performance, rank and earnings</p>
            </div>
            <div className="lg:col-span-2">
              <UserStats />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <ModuleErrorBoundary moduleName="Leaderboard">
                <Leaderboard />
              </ModuleErrorBoundary>
            </div>
            <div className="lg:col-span-1">
              <ModuleErrorBoundary moduleName="Campaign Guidelines">
                <CampaignRules />
              </ModuleErrorBoundary>
            </div>
          </div>

          <div className="mt-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="support" className="border-border">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm font-normal">
                    Need help? Contact support or join the community
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  Reach out via Discord or GitHub issues for technical assistance.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </AuthGuard>
    </main>
  );
}

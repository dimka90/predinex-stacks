'use client';

import Navbar from "../../components/Navbar";
import AuthGuard from "../../components/AuthGuard";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/ui/accordion";
import { Info } from "lucide-react";

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <AuthGuard>
        <div className="container mx-auto px-4 py-12 max-w-5xl">
           <div className="glass-panel p-8 rounded-2xl mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Rewards</h1>
              <p className="text-muted-foreground">Track your performance and earnings</p>
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

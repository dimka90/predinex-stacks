'use client';

import Navbar from "../components/Navbar";
import AuthGuard from "../components/AuthGuard";
import ActivityFeed from "../components/ActivityFeed";
import { useActivities } from "../lib/hooks/useActivities";
import { useStacks } from "../components/StacksProvider";
import { ScrollText } from "lucide-react";

export default function ActivityPage() {
    const { userData } = useStacks();
    const { activities, isLoading, error, refresh } = useActivities(50);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <AuthGuard>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                        <div className="flex items-center gap-5">
                            <div className="p-4 rounded-3xl bg-primary/10 border border-primary/20 text-primary">
                                <ScrollText size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tighter">Your Activity</h1>
                                <p className="text-muted-foreground font-medium">Full history of your on-chain interactions with Predinex.</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-8 rounded-3xl">
                        <ActivityFeed
                            activities={activities}
                            isLoading={isLoading}
                            error={error}
                            onRefresh={refresh}
                        />
                    </div>
                </div>
            </AuthGuard>
        </main>
    );
}

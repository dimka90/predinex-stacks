'use client';

import Navbar from "../components/Navbar";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <AuthGuard>
        <div className="pt-32 pb-20 max-w-6xl mx-auto px-4 sm:px-6">
          <Dashboard />
        </div>
      </AuthGuard>
    </main>
  );
}

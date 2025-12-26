'use client';

import Navbar from "../components/Navbar";
import AuthGuard from "../components/AuthGuard";
import { useState } from "react";
import { useStacks } from "../components/StacksProvider";
import { useWalletConnect } from "../lib/hooks/useWalletConnect";
import { openContractCall } from "@stacks/connect";
import { uintCV, stringAsciiCV } from "@stacks/transactions";
import { CONTRACT_ADDRESS, CONTRACT_NAME } from "../lib/constants";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function CreatePool() {
    const { userData, authenticate } = useStacks();
    const { session } = useWalletConnect();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        outcomeA: "",
        outcomeB: "",
        duration: "144",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setIsLoading(true);

        // Validate form
        if (!formData.title.trim() || formData.title.length < 5) {
            setError("Title must be at least 5 characters");
            setIsLoading(false);
            return;
        }

        if (!formData.description.trim() || formData.description.length < 10) {
            setError("Description must be at least 10 characters");
            setIsLoading(false);
            return;
        }

        if (formData.outcomeA.toLowerCase() === formData.outcomeB.toLowerCase()) {
            setError("Outcomes must be different");
            setIsLoading(false);
            return;
        }

        const duration = parseInt(formData.duration);
        if (duration < 10) {
            setError("Duration must be at least 10 blocks");
            setIsLoading(false);
            return;
        }

        const functionArgs = [
            stringAsciiCV(formData.title),
            stringAsciiCV(formData.description),
            stringAsciiCV(formData.outcomeA),
            stringAsciiCV(formData.outcomeB),
            uintCV(duration),
        ];

        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'create-pool',
                functionArgs,
                userSession: userData.userSession || undefined,
                onFinish: (data) => {
                    console.log('Pool created successfully:', data);
                    setSuccess(true);
                    setIsLoading(false);
                    // Reset form
                    setFormData({
                        title: "",
                        description: "",
                        outcomeA: "",
                        outcomeB: "",
                        duration: "144",
                    });
                    alert(`Pool created! Transaction ID: ${data.txId}`);
                },
                onCancel: () => {
                    console.log('Pool creation cancelled');
                    setIsLoading(false);
                    setError("Pool creation cancelled");
                },
            });
        } catch (err) {
            console.error("Pool creation failed", err);
            setIsLoading(false);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            <AuthGuard>
                <div className="pt-32 pb-20 max-w-2xl mx-auto px-4 sm:px-6">
                    <div className="glass p-8 rounded-2xl border border-border">
                        <h1 className="text-3xl font-bold mb-2">Create Prediction Pool</h1>
                        <p className="text-muted-foreground mb-8">Define a market and let the community decide the outcome.</p>

                        {/* Wallet Info */}
                        {session?.isConnected && (
                            <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Pool Creator</p>
                                        <p className="font-mono text-sm">{session.address.slice(0, 8)}...{session.address.slice(-6)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Network</p>
                                        <p className="font-bold capitalize">{session.network}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-green-600">Pool created successfully!</p>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="e.g., Bitcoin Price > $100k?"
                                    value={formData.title}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-muted-foreground mt-1">{formData.title.length}/256 characters</p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all h-32 resize-none"
                                    placeholder="Provide details about the resolution criteria..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-muted-foreground mt-1">{formData.description.length}/512 characters</p>
                            </div>

                            {/* Outcomes Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-green-400">Outcome A</label>
                                    <input
                                        type="text"
                                        name="outcomeA"
                                        required
                                        className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                                        placeholder="e.g., Yes"
                                        value={formData.outcomeA}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-red-400">Outcome B</label>
                                    <input
                                        type="text"
                                        name="outcomeB"
                                        required
                                        className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                                        placeholder="e.g., No"
                                        value={formData.outcomeB}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Duration (Blocks)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    required
                                    min="10"
                                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="144"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-muted-foreground mt-2">144 blocks ≈ 24 hours</p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-primary hover:bg-violet-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating Pool...
                                    </>
                                ) : (
                                    "Create Pool"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </AuthGuard>
        </main>
    );
}

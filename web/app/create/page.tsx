'use client';

import Navbar from "../components/Navbar";
import AuthGuard from "../components/AuthGuard";
import { useState } from "react";
import { useStacks } from "../components/StacksProvider";
import { openContractCall } from "@stacks/connect";
import { uintCV, stringAsciiCV } from "@stacks/transactions";
import { CONTRACT_ADDRESS, CONTRACT_NAME } from "../lib/constants";
import { Loader2 } from "lucide-react";

export default function CreatePool() {
    const { userData, authenticate } = useStacks();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        outcomeA: "",
        outcomeB: "",
        duration: "144", // Default ~1 day (144 blocks)
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const functionArgs = [
            stringAsciiCV(formData.title),
            stringAsciiCV(formData.description),
            stringAsciiCV(formData.outcomeA),
            stringAsciiCV(formData.outcomeB),
            uintCV(parseInt(formData.duration)),
        ];

        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'create-pool',
                functionArgs,
                userSession: userData.userSession || undefined,
                onFinish: (data) => {
                    console.log('Transaction finished:', data);
                    setIsLoading(false);
                    // Redirect or show success message?
                    alert(`Transaction broadcasted! TxId: ${data.txId}`);
                },
                onCancel: () => {
                    console.log('Transaction canceled');
                    setIsLoading(false);
                },
            });
        } catch (error) {
            console.error("Contract call failed", error);
            setIsLoading(false);
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
                                />
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
                                />
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
                                        Requesting Signature...
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

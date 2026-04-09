import React, { useState } from 'react';

const DisputeModal = ({ poolId, onClose }: { poolId: number, onClose: () => void }) => {
    const [reason, setReason] = useState('');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-2xl p-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-slate-950 border border-white/5 w-full max-w-lg rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600/50 via-red-500 to-red-600/50" />
                <h2 className="text-3xl font-black mb-4 tracking-tighter uppercase">File a Dispute</h2>
                <p className="text-sm text-muted-foreground mb-8 leading-relaxed font-medium">
                    If you believe the outcome of pool <span className="text-white font-bold">#{poolId}</span> is incorrect, you can file a dispute.
                    This requires a <span className="text-red-400 font-bold">5% security bond</span> to prevent spam.
                </p>

                <textarea
                    className="w-full h-40 bg-background border border-border rounded-2xl p-5 text-sm mb-8 focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 outline-none transition-all font-medium resize-none"
                    placeholder="Provide evidence or reason for dispute..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />

                <div className="flex gap-4">
                    <button className="flex-1 py-3 bg-slate-800 rounded-xl font-bold hover:bg-slate-700 transition-colors" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="flex-1 py-3 bg-red-600 rounded-xl font-bold hover:bg-red-500 transition-colors">
                        Submit Dispute
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DisputeModal;

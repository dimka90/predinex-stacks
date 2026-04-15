import React, { useState } from 'react';

const DisputeModal = ({ poolId, onClose }: { poolId: number, onClose: () => void }) => {
    const [reason, setReason] = useState('');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-3xl p-4 animate-in fade-in zoom-in-95 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="bg-black/60 border border-white/10 w-full max-w-lg rounded-[2.5rem] p-10 shadow-[0_20px_60px_rgba(220,38,38,0.15)] relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600/10 via-red-500 to-red-600/10 shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[60px] rounded-full mix-blend-screen pointer-events-none" />

                <h2 className="text-3xl font-black mb-4 tracking-[0.2em] uppercase relative z-10">File a Dispute</h2>
                <p className="text-xs text-muted-foreground/80 mb-8 leading-relaxed font-bold tracking-widest uppercase relative z-10">
                    If you believe the outcome of pool <span className="text-white">#{poolId}</span> is incorrect, you can file a dispute.
                    This requires a <span className="text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">5% security bond</span> to prevent spam.
                </p>

                <textarea
                    className={`w-full h-40 bg-black/40 border ${reason.length > 0 && reason.length < 10 ? 'border-red-500' : 'border-white/10'} rounded-2xl p-5 text-sm mb-8 focus-visible:ring-4 focus-visible:ring-red-500/30 focus-visible:border-red-500/50 outline-none transition-all font-medium resize-none shadow-inner relative z-10`}
                    placeholder="PROVIDE EVIDENCE OR REASON FOR DISPUTE..."
                    value={reason}
                    maxLength={500}
                    aria-invalid={reason.length > 0 && reason.length < 10}
                    onChange={(e) => setReason(e.target.value)}
                />

                <div className="flex gap-4 relative z-10">
                    <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white/10 transition-colors active:scale-95 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="flex-1 py-4 bg-red-600/90 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-95 border border-red-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                        Submit Dispute
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DisputeModal;

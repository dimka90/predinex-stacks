import React, { useState } from 'react';

const DisputeModal = ({ poolId, onClose }: { poolId: number, onClose: () => void }) => {
    const [reason, setReason] = useState('');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold mb-4">File a Dispute</h2>
                <p className="text-sm text-slate-400 mb-6">
                    If you believe the outcome of pool #{poolId} is incorrect, you can file a dispute.
                    This requires a 5% security bond.
                </p>

                <textarea
                    className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm mb-6 focus:border-primary outline-none transition-colors"
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

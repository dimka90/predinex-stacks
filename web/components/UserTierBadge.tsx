import React from 'react';

interface TierBadgeProps {
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

const UserTierBadge = ({ tier }: TierBadgeProps) => {
    const styles = {
        Bronze: 'bg-orange-900/20 text-orange-500 border-orange-900/50',
        Silver: 'bg-slate-300/10 text-slate-400 border-slate-300/20',
        Gold: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        Platinum: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[tier]}`}>
            {tier} Status
        </span>
    );
};

export default UserTierBadge;

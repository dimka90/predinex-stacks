'use client';

import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, boolCV } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../constants';
import { useStacks } from '../../components/StacksProvider';

export function useMarketSettlement() {
    const { userData } = useStacks();
    const [isSettling, setIsSettling] = useState(false);

    const settleMarket = async (poolId: number, outcome: boolean) => {
        if (!userData) throw new Error("Wallet not connected");

        setIsSettling(true);
        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'settle-pool',
                functionArgs: [
                    uintCV(poolId),
                    boolCV(outcome)
                ],
                onFinish: (data) => {
                    console.log("Market settlement initiated:", data);
                    setIsSettling(false);
                },
                onCancel: () => {
                    setIsSettling(false);
                }
            });
        } catch (error) {
            setIsSettling(false);
            throw error;
        }
    };

    return {
        settleMarket,
        isSettling
    };
}

'use client';

import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { stringUtf8CV, uintCV } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../constants';
import { useStacks } from '../../components/StacksProvider';

export function useMarketCreation() {
    const { userData } = useStacks();
    const [isCreating, setIsCreating] = useState(false);

    const createMarket = async (params: {
        title: string;
        description: string;
        outcomeA: string;
        outcomeB: string;
        expiry: number;
        initialLiq: number;
    }) => {
        if (!userData) throw new Error("Wallet not connected");

        setIsCreating(true);
        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'create-pool',
                functionArgs: [
                    stringUtf8CV(params.title),
                    stringUtf8CV(params.description),
                    stringUtf8CV(params.outcomeA),
                    stringUtf8CV(params.outcomeB),
                    uintCV(params.expiry),
                    uintCV(Math.floor(params.initialLiq * 1_000_000))
                ],
                onFinish: (data) => {
                    console.log("Market creation initiated:", data);
                    setIsCreating(false);
                },
                onCancel: () => {
                    setIsCreating(false);
                }
            });
        } catch (error) {
            setIsCreating(false);
            throw error;
        }
    };

    return {
        createMarket,
        isCreating
    };
}

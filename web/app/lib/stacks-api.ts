import { STACKS_MAINNET, StacksNetwork } from "@stacks/network";
import { fetchCallReadOnlyFunction, cvToValue, uintCV, ClarityValue } from "@stacks/transactions";
import { CONTRACT_ADDRESS, CONTRACT_NAME } from "./constants";

// Use mainnet for production
const network: StacksNetwork = STACKS_MAINNET;

export interface Pool {
    id: number;
    title: string;
    description: string;
    creator: string;
    outcomeA: string;
    outcomeB: string;
    totalA: number;
    totalB: number;
    settled: boolean;
    winningOutcome: number | null;
    expiry: number;
}

export async function getPoolCount(): Promise<number> {
    try {
        const result = await fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'get-pool-count',
            functionArgs: [],
            senderAddress: CONTRACT_ADDRESS,
            network,
        });

        const value = cvToValue(result);
        return Number(value);
    } catch (e) {
        console.error("Failed to fetch pool count", e);
        return 0;
    }
}

export async function getPool(poolId: number): Promise<Pool | null> {
    try {
        const result = await fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'get-pool',
            functionArgs: [uintCV(poolId)],
            senderAddress: CONTRACT_ADDRESS,
            network,
        });

        const value = cvToValue(result, true); // true for readable format
        if (!value) return null;

        // Handle (some {...}) vs (none)
        // cvToValue with readable=true returns null for none, object for some
        return {
            id: poolId,
            title: value.title,
            description: value.description,
            creator: value.creator,
            outcomeA: value['outcome-a-name'],
            outcomeB: value['outcome-b-name'],
            totalA: Number(value['total-a']),
            totalB: Number(value['total-b']),
            settled: value.settled,
            winningOutcome: value['winning-outcome'] ?? null,
            expiry: Number(value.expiry ?? 0),
        };
    } catch (e) {
        console.error(`Failed to fetch pool ${poolId}`, e);
        return null;
    }
}

export async function fetchActivePools(): Promise<Pool[]> {
    const count = await getPoolCount();
    const pools: Pool[] = [];

    for (let i = count - 1; i >= 0; i--) {
        const pool = await getPool(i);
        if (pool) pools.push(pool);
    }
    return pools;
}

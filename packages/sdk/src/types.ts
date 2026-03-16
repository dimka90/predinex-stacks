export interface PoolData {
    poolId: number;
    creator: string;
    title: string;
    description: string;
    outcomeAName: string;
    outcomeBName: string;
    totalA: bigint;
    totalB: bigint;
    settled: boolean;
    winningOutcome: number | null;
    createdAt: number;
    settledAt: number | null;
    expiry: number;
}

export interface MarketStats {
    totalPool: number;
    percentageA: number;
    percentageB: number;
}

export interface StacksClientConfig {
    network: 'mainnet' | 'testnet' | 'devnet';
    contractAddress: string;
    contractName: string;
    senderAddress?: string;
}

export type MarketStatus = 'active' | 'settled' | 'expired';

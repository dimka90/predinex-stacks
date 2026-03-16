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

export interface OracleProvider {
    id: number;
    address: string;
    reputationScore: number;
    totalSubmissions: number;
    successfulSubmissions: number;
    isActive: boolean;
    isBanned: boolean;
    activationHeight: number;
}

export interface OracleSubmission {
    poolId: number;
    providerId: number;
    value: string;
    confidence: number;
    timestamp: number;
}

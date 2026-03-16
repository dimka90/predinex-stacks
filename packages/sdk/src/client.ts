import {
    fetchCallReadOnlyFunction,
    cvToValue,
    uintCV
} from "@stacks/transactions";
import {
    STACKS_MAINNET,
    STACKS_TESTNET,
    StacksNetwork
} from "@stacks/network";
import { PoolData, MarketStats, StacksClientConfig, OracleProvider, OracleSubmission } from './types';

export class StacksClient {
    private network: StacksNetwork;
    private contractAddress: string;
    private contractName: string;
    private senderAddress: string;

    constructor(config: StacksClientConfig) {
        this.contractAddress = config.contractAddress;
        this.contractName = config.contractName;
        this.senderAddress = config.senderAddress || config.contractAddress;

        if (config.network === 'mainnet') {
            this.network = STACKS_MAINNET;
        } else {
            this.network = STACKS_TESTNET;
        }
    }

    async getPoolCount(): Promise<number> {
        try {
            const result = await fetchCallReadOnlyFunction({
                contractAddress: this.contractAddress,
                contractName: this.contractName,
                functionName: 'get-pool-count',
                functionArgs: [],
                senderAddress: this.senderAddress,
                network: this.network,
            });

            return Number(cvToValue(result));
        } catch (e) {
            console.error("Failed to fetch pool count", e);
            return 0;
        }
    }

    async getPool(poolId: number): Promise<PoolData | null> {
        try {
            const result = await fetchCallReadOnlyFunction({
                contractAddress: this.contractAddress,
                contractName: this.contractName,
                functionName: 'get-pool',
                functionArgs: [uintCV(poolId)],
                senderAddress: this.senderAddress,
                network: this.network,
            });

            const value = cvToValue(result, true);
            if (!value) return null;

            return {
                poolId,
                creator: value.creator,
                title: value.title,
                description: value.description,
                outcomeAName: value['outcome-a-name'],
                outcomeBName: value['outcome-b-name'],
                totalA: BigInt(value['total-a'] || 0),
                totalB: BigInt(value['total-b'] || 0),
                settled: value.settled,
                winningOutcome: value['winning-outcome'] ?? null,
                createdAt: Number(value['created-at'] || 0),
                settledAt: value['settled-at'] ? Number(value['settled-at']) : null,
                expiry: Number(value.expiry || 0),
            };
        } catch (e) {
            console.error(`Failed to fetch pool ${poolId}`, e);
            return null;
        }
    }

    async getPoolStats(poolId: number): Promise<MarketStats | null> {
        try {
            const result = await fetchCallReadOnlyFunction({
                contractAddress: this.contractAddress,
                contractName: this.contractName,
                functionName: 'get-pool-stats',
                functionArgs: [uintCV(poolId)],
                senderAddress: this.senderAddress,
                network: this.network,
            });

            const value = cvToValue(result, true);
            if (!value) return null;

            return {
                totalPool: Number(value['total-pool'] || 0),
                percentageA: Number(value['percentage-a'] || 0),
                percentageB: Number(value['percentage-b'] || 0),
            };
        } catch (e) {
            console.error(`Failed to fetch pool stats ${poolId}`, e);
            return null;
        }
    }

    async fetchAllPools(page: number = 0, pageSize: number = 20): Promise<PoolData[]> {
        const totalCount = await this.getPoolCount();
        if (totalCount === 0) return [];

        const startId = Math.max(0, totalCount - 1 - (page * pageSize));
        const endId = Math.max(0, startId - pageSize + 1);

        // Efficiently fetch multiple pools
        const pools: PoolData[] = [];
        for (let i = startId; i >= endId; i--) {
            const pool = await this.getPool(i);
            if (pool) pools.push(pool);
        }

        return pools;
    }

    async getOracleProvider(providerId: number): Promise<OracleProvider | null> {
        try {
            const result = await fetchCallReadOnlyFunction({
                contractAddress: this.contractAddress,
                contractName: 'predinex-oracle-registry', // Assuming default registry name
                functionName: 'get-provider-details',
                functionArgs: [uintCV(providerId)],
                senderAddress: this.senderAddress,
                network: this.network,
            });

            const value = cvToValue(result, true);
            if (!value) return null;

            return {
                id: providerId,
                address: value.address,
                reputationScore: Number(value['reputation-score']),
                totalSubmissions: Number(value['total-submissions']),
                successfulSubmissions: Number(value['successful-submissions']),
                isActive: value['is-active'],
                isBanned: value['is-banned'],
                activationHeight: Number(value['activation-height']),
            };
        } catch (e) {
            console.error(`Failed to fetch oracle provider ${providerId}`, e);
            return null;
        }
    }

    async getLatestAggregation(poolId: number): Promise<OracleSubmission | null> {
        try {
            const result = await fetchCallReadOnlyFunction({
                contractAddress: this.contractAddress,
                contractName: 'predinex-oracle-registry',
                functionName: 'get-latest-aggregation',
                functionArgs: [uintCV(poolId)],
                senderAddress: this.senderAddress,
                network: this.network,
            });

            const value = cvToValue(result, true);
            if (!value) return null;

            return {
                poolId,
                providerId: 0, // Aggregated results might not have a single provider ID
                value: value.value,
                confidence: Number(value['confidence-score']),
                timestamp: Number(value.timestamp),
            };
        } catch (e) {
            console.error(`Failed to fetch latest aggregation for pool ${poolId}`, e);
            return null;
        }
    }
}

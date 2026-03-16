# predinex-stacks-sdk

The official TypeScript SDK for interacting with the Predinex prediction market protocol on the Stacks blockchain.

## Features

- **Type-safe**: Built with TypeScript for a superior developer experience.
- **Easy to use**: Simplified interface for fetching pools, market stats, and user data.
- **Efficient**: Optimized for batch fetching and low latency.
- **Cross-network**: Seamlessly switch between Mainnet, Testnet, and Devnet.

## Installation

```bash
npm install predinex-stacks-sdk
# or
yarn add predinex-stacks-sdk
# or
pnpm add predinex-stacks-sdk
```

## Quick Start

```typescript
import { StacksClient } from "predinex-stacks-sdk";

const client = new StacksClient({
  network: 'mainnet',
  contractAddress: 'SP...',
  contractName: 'predinex-pool-v1'
});

// Fetch total pool count
const count = await client.getPoolCount();

// Get detailed data for a specific pool
const pool = await client.getPool(1);

console.log(`Pool #1: ${pool.title} - ${pool.totalA} vs ${pool.totalB}`);
```

## API Reference

### `StacksClient`

#### `getPoolCount(): Promise<number>`
Returns the total number of pools created in the protocol.

#### `getPool(poolId: number): Promise<PoolData | null>`
Fetches detailed information for a specific pool.

#### `getPoolStats(poolId: number): Promise<MarketStats | null>`
Fetches volume and percentage statistics for a specific pool.

#### `fetchAllPools(page?: number, pageSize?: number): Promise<PoolData[]>`
Fetches a paginated list of pools, starting from the most recent.

## License

MIT

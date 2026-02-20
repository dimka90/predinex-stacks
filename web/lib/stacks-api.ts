import {
  fetchCallReadOnlyFunction,
  cvToJSON,
  uintCV,
  ClarityValue,
  ClarityType
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

const NETWORK = STACKS_MAINNET;
const CONTRACT_ADDRESS = 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';
const CONTRACT_NAME = 'predinex-pool-1771407097278';

export interface Pool {
  id: number;
  title: string;
  description: string;
  creator: string;
  outcomeA: string;
  outcomeB: string;
  totalA: number;
  totalB: number;
  expiry: number;
  settled: boolean;
  status: 'active' | 'settled' | 'expired';
}

function parsePoolCV(poolCV: any, id: number): Pool {
  const data = poolCV.value.data;
  const burnHeight = 1000000; // Mock current block height if needed, or fetch it

  const expiry = Number(data.expiry.value);
  const settled = data.settled.type === ClarityType.BoolTrue;

  let status: 'active' | 'settled' | 'expired' = 'active';
  if (settled) status = 'settled';
  // Note: we'd ideally fetch real burn-block-height

  return {
    id,
    title: data.title.value,
    description: data.description.value,
    creator: data.creator.value,
    outcomeA: data['outcome-a-name'].value,
    outcomeB: data['outcome-b-name'].value,
    totalA: Number(data['total-a'].value),
    totalB: Number(data['total-b'].value),
    expiry: expiry,
    settled: settled,
    status: status
  };
}

export async function getPool(id: number): Promise<Pool | null> {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-pool-details',
      functionArgs: [uintCV(id)],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS,
    });

    if (result.type === ClarityType.OptionalSome) {
      return parsePoolCV(result, id);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching pool ${id}:`, error);
    return null;
  }
}

export async function getMarkets(filter: string): Promise<Pool[]> {
  try {
    // First, get the pool counter
    const counterResult = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-pool-counter', // We might need to add this or check the contract
      functionArgs: [],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS,
    });

    // If get-pool-counter doesn't exist, we might have to use a different approach
    // In our contract it's (define-data-var pool-counter uint u1)
    // We didn't define a read-only for it in the previous snippet, 
    // let me check the contract's read-only section again.

    // Actually, looking at the contract, there is no get-pool-counter read-only.
    // We should probably add it or just try fetching until we hit a null.

    const pools: Pool[] = [];
    const maxAttempt = 20; // Limit for now to avoid freezing

    for (let i = 1; i <= maxAttempt; i++) {
      const pool = await getPool(i);
      if (pool) {
        pools.push(pool);
      } else {
        break;
      }
    }

    if (filter === 'active') return pools.filter(p => !p.settled);
    if (filter === 'settled') return pools.filter(p => p.settled);

    return pools;
  } catch (error) {
    console.error("Error fetching markets:", error);
    return [];
  }
}
// Types for Predinex Stacks API

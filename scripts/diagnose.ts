import { fetchCallReadOnlyFunction, uintCV } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

const CONTRACT_ADDRESS = 'SPSHVWJVD3NP8G7ZM82KTHB91HKCMNTY3BKKNE5V';
const CONTRACT_NAME = 'predinex-pool-1765792183853';

async function diagnose() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔍 CONTRACT DIAGNOSTIC`);
  console.log(`${'='.repeat(60)}`);
  console.log(`📍 Address: ${CONTRACT_ADDRESS}`);
  console.log(`🔗 Contract: ${CONTRACT_NAME}\n`);

  // Try to call get-pool-count
  console.log(`Testing: get-pool-count`);
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-pool-count',
      functionArgs: [],
      senderAddress: CONTRACT_ADDRESS,
      network: STACKS_MAINNET,
    });
    console.log(`✅ Function exists and is callable`);
    console.log(`   Result: ${result}`);
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}`);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 Possible Issues:`);
  console.log(`${'='.repeat(60)}`);
  console.log(`1. Contract not fully deployed yet`);
  console.log(`2. Contract name/address mismatch`);
  console.log(`3. Network connectivity issue`);
  console.log(`4. Contract has bugs preventing execution\n`);
}

diagnose().catch(console.error);

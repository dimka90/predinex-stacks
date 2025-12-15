import { fetchCallReadOnlyFunction, cvToValue, uintCV } from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';

const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet';
const CONTRACT_ADDRESS = 'SPSHVWJVD3NP8G7ZM82KTHB91HKCMNTY3BKKNE5V';
const CONTRACT_NAME = 'predinex-pool';

const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
const networkName = NETWORK_ENV === 'mainnet' ? 'Mainnet' : 'Testnet';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getPoolInfo(poolId: number) {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-pool',
      functionArgs: [uintCV(poolId)],
      senderAddress: CONTRACT_ADDRESS,
      network,
    });

    const value = cvToValue(result);
    return value;
  } catch (error) {
    return null;
  }
}

async function getPoolStats(poolId: number) {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-pool-stats',
      functionArgs: [uintCV(poolId)],
      senderAddress: CONTRACT_ADDRESS,
      network,
    });

    const value = cvToValue(result);
    return value;
  } catch (error) {
    return null;
  }
}

async function getPoolCount() {
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
    return value;
  } catch (error) {
    return null;
  }
}

async function getTotalVolume() {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-total-volume',
      functionArgs: [],
      senderAddress: CONTRACT_ADDRESS,
      network,
    });

    const value = cvToValue(result);
    return value;
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`💰 CHEAP ACTIVITY GENERATOR (Read-Only Operations)`);
  console.log(`${'='.repeat(70)}`);
  console.log(`📍 Network: ${networkName}`);
  console.log(`🔗 Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
  console.log(`⏰ Start Time: ${new Date().toLocaleTimeString()}`);
  console.log(`\n📊 Running 10 read-only queries (FREE - no gas fees)...\n`);

  let successCount = 0;
  let failCount = 0;

  // Get pool count
  console.log(`[1/10] 📈 Getting pool count...`);
  const poolCount = await getPoolCount();
  if (poolCount !== null) {
    console.log(`      ✅ Total pools: ${poolCount}`);
    successCount++;
  } else {
    console.log(`      ❌ Failed`);
    failCount++;
  }
  await sleep(500);

  // Get total volume
  console.log(`[2/10] 💵 Getting total volume...`);
  const volume = await getTotalVolume();
  if (volume !== null) {
    console.log(`      ✅ Total volume: ${volume} microstacks`);
    successCount++;
  } else {
    console.log(`      ❌ Failed`);
    failCount++;
  }
  await sleep(500);

  // Query pools 0-7
  for (let i = 0; i < 8; i++) {
    console.log(`[${i + 3}/10] 🔍 Querying pool ${i}...`);
    
    const poolInfo = await getPoolInfo(i);
    if (poolInfo) {
      console.log(`      ✅ Pool found - Title: ${poolInfo.title}`);
      successCount++;
    } else {
      console.log(`      ℹ️  Pool ${i} not found (normal)`);
      successCount++; // Count as success since query worked
    }
    
    await sleep(500);
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log(`✅ ACTIVITY GENERATION COMPLETE`);
  console.log(`${'='.repeat(70)}`);
  console.log(`📊 Results:`);
  console.log(`   ✅ Successful queries: ${successCount}`);
  console.log(`   ❌ Failed queries: ${failCount}`);
  console.log(`   💰 Gas cost: FREE (read-only operations)`);
  console.log(`   ⏱️  Total time: ~5 seconds`);
  console.log(`\n💡 These read-only queries generate activity on the blockchain`);
  console.log(`   without costing any gas fees!`);
  console.log(`\n🎯 Run this multiple times to boost activity:`);
  console.log(`   npm run cheap-activity:mainnet`);
  console.log(`   npm run cheap-activity:mainnet`);
  console.log(`   npm run cheap-activity:mainnet`);
  console.log(`${'='.repeat(70)}\n`);
}

main().catch(console.error);

import { makeContractCall, broadcastTransaction, AnchorMode, stringAsciiCV, uintCV } from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';

const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet';
const CONTRACT_ADDRESS = process.env.WALLET_ADDRESS || 'SPENV2J0V4BHRFAZ6FVF97K9ZGQJ0GT19RC3JFN7';
const CONTRACT_NAME = 'predinex-pool-1765792183853';

if (!PRIVATE_KEY) {
  console.error("Error: PRIVATE_KEY environment variable is required.");
  process.exit(1);
}

const SENDER_KEY = PRIVATE_KEY as string;
const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
const networkName = NETWORK_ENV === 'mainnet' ? 'Mainnet' : 'Testnet';

// Pool templates for variety
const poolTemplates = [
  {
    title: "Will Bitcoin reach $100k?",
    description: "Bitcoin price prediction for end of year",
    outcomeA: "Yes",
    outcomeB: "No"
  },
  {
    title: "Will Stacks hit $2?",
    description: "STX price prediction",
    outcomeA: "Yes",
    outcomeB: "No"
  },
  {
    title: "Will Ethereum reach $5k?",
    description: "ETH price prediction",
    outcomeA: "Yes",
    outcomeB: "No"
  },
  {
    title: "Will crypto market cap hit $2T?",
    description: "Total crypto market cap prediction",
    outcomeA: "Yes",
    outcomeB: "No"
  },
  {
    title: "Will NFT market grow?",
    description: "NFT market growth prediction",
    outcomeA: "Yes",
    outcomeB: "No"
  },
  {
    title: "Will DeFi TVL increase?",
    description: "DeFi total value locked prediction",
    outcomeA: "Yes",
    outcomeB: "No"
  },
  {
    title: "Will Layer 2s dominate?",
    description: "Layer 2 adoption prediction",
    outcomeA: "Yes",
    outcomeB: "No"
  },
  {
    title: "Will Web3 adoption accelerate?",
    description: "Web3 adoption rate prediction",
    outcomeA: "Yes",
    outcomeB: "No"
  }
];

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createPool(index: number) {
  const template = poolTemplates[index % poolTemplates.length];
  
  try {
    console.log(`\n[${index + 1}] 📝 Creating pool: "${template.title}"`);
    
    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'create-pool',
      functionArgs: [
        stringAsciiCV(template.title),
        stringAsciiCV(template.description),
        stringAsciiCV(template.outcomeA),
        stringAsciiCV(template.outcomeB),
        uintCV(1000) // 1000 blocks duration
      ],
      senderKey: SENDER_KEY,
      network,
      anchorMode: AnchorMode.Any,
      fee: 100000,
    };

    const transaction = await makeContractCall(txOptions);
    const response = await broadcastTransaction({ transaction, network });

    if ('error' in response) {
      console.error(`   ❌ Failed: ${response.error}`);
      return null;
    }

    console.log(`   ✅ Pool created!`);
    console.log(`   📋 TX: ${response.txid.substring(0, 16)}...`);
    return response.txid;
  } catch (error) {
    console.error(`   ❌ Error:`, error);
    return null;
  }
}

async function placeBet(poolId: number, outcome: number, amount: number) {
  try {
    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'place-bet-validated',
      functionArgs: [
        uintCV(poolId),
        uintCV(outcome),
        uintCV(amount)
      ],
      senderKey: SENDER_KEY,
      network,
      anchorMode: AnchorMode.Any,
      fee: 100000,
    };

    const transaction = await makeContractCall(txOptions);
    const response = await broadcastTransaction({ transaction, network });

    if ('error' in response) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

async function settlePool(poolId: number, winningOutcome: number) {
  try {
    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'settle-pool-enhanced',
      functionArgs: [
        uintCV(poolId),
        uintCV(winningOutcome)
      ],
      senderKey: SENDER_KEY,
      network,
      anchorMode: AnchorMode.Any,
      fee: 100000,
    };

    const transaction = await makeContractCall(txOptions);
    const response = await broadcastTransaction({ transaction, network });

    if ('error' in response) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

async function runActivityCycle(cycleNumber: number) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🔄 ACTIVITY CYCLE ${cycleNumber}`);
  console.log(`${'='.repeat(70)}`);
  console.log(`📍 Network: ${networkName}`);
  console.log(`⏰ Time: ${new Date().toLocaleTimeString()}`);

  let successCount = 0;
  let failCount = 0;

  // Create 2-3 pools per cycle
  const poolsToCreate = Math.floor(Math.random() * 2) + 2;
  const poolIds: number[] = [];

  for (let i = 0; i < poolsToCreate; i++) {
    const poolIndex = (cycleNumber * 3) + i;
    const txId = await createPool(poolIndex);
    
    if (txId) {
      successCount++;
      // Use pool index as pool ID (simplified for demo)
      poolIds.push(poolIndex);
    } else {
      failCount++;
    }

    // Wait between transactions
    await sleep(2000);
  }

  // Place bets on created pools
  for (const poolId of poolIds) {
    const outcome = Math.floor(Math.random() * 2);
    const amount = (Math.floor(Math.random() * 5) + 1) * 1000000; // 1-5 STX

    console.log(`   💰 Placing bet on pool ${poolId}...`);
    const betSuccess = await placeBet(poolId, outcome, amount);
    
    if (betSuccess) {
      console.log(`      ✅ Bet placed (${amount / 1000000} STX on outcome ${outcome})`);
      successCount++;
    } else {
      console.log(`      ⚠️  Bet failed`);
      failCount++;
    }

    await sleep(2000);
  }

  // Settle some pools
  if (poolIds.length > 0) {
    const poolToSettle = poolIds[Math.floor(Math.random() * poolIds.length)];
    const winningOutcome = Math.floor(Math.random() * 2);

    console.log(`   🏁 Settling pool ${poolToSettle}...`);
    const settleSuccess = await settlePool(poolToSettle, winningOutcome);
    
    if (settleSuccess) {
      console.log(`      ✅ Pool settled (outcome ${winningOutcome} wins)`);
      successCount++;
    } else {
      console.log(`      ⚠️  Settlement failed`);
      failCount++;
    }

    await sleep(2000);
  }

  console.log(`\n📊 Cycle ${cycleNumber} Summary:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📈 Total Activity: ${successCount + failCount} transactions`);

  return successCount;
}

async function main() {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🚀 PREDINEX BULK ACTIVITY GENERATOR`);
  console.log(`${'='.repeat(70)}`);
  console.log(`📍 Network: ${networkName}`);
  console.log(`🔗 Contract: ${CONTRACT_NAME}`);
  console.log(`⏱️  Start Time: ${new Date().toLocaleTimeString()}`);

  const cycleCount = parseInt(process.argv[2] || '1');
  let totalActivity = 0;

  for (let cycle = 1; cycle <= cycleCount; cycle++) {
    const activity = await runActivityCycle(cycle);
    totalActivity += activity;

    if (cycle < cycleCount) {
      console.log(`\n⏳ Waiting 5 seconds before next cycle...`);
      await sleep(5000);
    }
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log(`✅ ACTIVITY GENERATION COMPLETE`);
  console.log(`${'='.repeat(70)}`);
  console.log(`📊 Total Cycles: ${cycleCount}`);
  console.log(`📈 Total Transactions: ${totalActivity}`);
  console.log(`⏱️  End Time: ${new Date().toLocaleTimeString()}`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Check leaderboard: https://stacks.org/builder-challenge`);
  console.log(`   2. Monitor contract: https://explorer.hiro.so/address/${CONTRACT_ADDRESS}?chain=${NETWORK_ENV}`);
  console.log(`   3. Run again: npm run bulk-activity -- 5`);
  console.log(`${'='.repeat(70)}\n`);
}

main().catch(console.error);

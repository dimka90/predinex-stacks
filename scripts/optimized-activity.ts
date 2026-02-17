import { makeContractCall, broadcastTransaction, AnchorMode, stringAsciiCV, uintCV } from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';

const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet';
const CONTRACT_ADDRESS = process.env.WALLET_ADDRESS || 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';
const CONTRACT_NAME = 'predinex-pool-1765792183853';

if (!PRIVATE_KEY) {
  console.error("Error: PRIVATE_KEY environment variable is required.");
  process.exit(1);
}

const SENDER_KEY = PRIVATE_KEY as string;
const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
const networkName = NETWORK_ENV === 'mainnet' ? 'Mainnet' : 'Testnet';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createPool(title: string, description: string, outcomeA: string, outcomeB: string) {
  try {
    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'create-pool',
      functionArgs: [
        stringAsciiCV(title),
        stringAsciiCV(description),
        stringAsciiCV(outcomeA),
        stringAsciiCV(outcomeB),
        uintCV(500) // Shorter duration
      ],
      senderKey: SENDER_KEY,
      network,
      anchorMode: AnchorMode.Any,
      fee: 50000, // Lower fee
    };

    const transaction = await makeContractCall(txOptions);
    const response = await broadcastTransaction({ transaction, network });

    if ('error' in response) {
      return null;
    }

    return response.txid;
  } catch (error) {
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
      fee: 50000, // Lower fee
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

async function main() {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🚀 OPTIMIZED ACTIVITY GENERATOR`);
  console.log(`${'='.repeat(70)}`);
  console.log(`📍 Network: ${networkName}`);
  console.log(`🔗 Contract: ${CONTRACT_NAME}`);
  console.log(`⏱️  Start Time: ${new Date().toLocaleTimeString()}`);
  console.log(`💰 Low fees (50,000 microstacks per transaction)`);

  const cycleCount = parseInt(process.argv[2] || '1');
  let totalSuccess = 0;
  let totalFailed = 0;

  const pools = [
    { title: "Bitcoin $100k?", desc: "BTC price", a: "Yes", b: "No" },
    { title: "Stacks $2?", desc: "STX price", a: "Yes", b: "No" },
    { title: "Ethereum $5k?", desc: "ETH price", a: "Yes", b: "No" },
    { title: "Crypto $2T?", desc: "Market cap", a: "Yes", b: "No" },
    { title: "NFT growth?", desc: "NFT market", a: "Yes", b: "No" },
  ];

  for (let cycle = 1; cycle <= cycleCount; cycle++) {
    console.log(`\n[Cycle ${cycle}/${cycleCount}]`);
    
    // Create 1 pool per cycle
    const pool = pools[cycle % pools.length];
    console.log(`  📝 Creating pool: "${pool.title}"`);
    
    const poolTx = await createPool(pool.title, pool.desc, pool.a, pool.b);
    if (poolTx) {
      console.log(`     ✅ Success`);
      totalSuccess++;
    } else {
      console.log(`     ❌ Failed`);
      totalFailed++;
    }

    // Place 1 bet
    if (poolTx) {
      console.log(`  💰 Placing bet...`);
      const amount = (Math.floor(Math.random() * 3) + 1) * 1000000; // 1-3 STX
      const outcome = Math.floor(Math.random() * 2);
      
      const betSuccess = await placeBet(cycle - 1, outcome, amount);
      if (betSuccess) {
        console.log(`     ✅ Success (${amount / 1000000} STX)`);
        totalSuccess++;
      } else {
        console.log(`     ⚠️  Failed`);
        totalFailed++;
      }
    }

    if (cycle < cycleCount) {
      console.log(`  ⏳ Waiting 3 seconds...`);
      await sleep(3000);
    }
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log(`✅ COMPLETE`);
  console.log(`${'='.repeat(70)}`);
  console.log(`📊 Results:`);
  console.log(`   ✅ Successful: ${totalSuccess}`);
  console.log(`   ❌ Failed: ${totalFailed}`);
  console.log(`   📈 Total: ${totalSuccess + totalFailed} transactions`);
  console.log(`   💰 Cost: ~${(totalSuccess + totalFailed) * 50000 / 1000000} STX`);
  console.log(`\n🎯 Run again: npm run optimized-activity:mainnet -- 10`);
  console.log(`${'='.repeat(70)}\n`);
}

main().catch(console.error);

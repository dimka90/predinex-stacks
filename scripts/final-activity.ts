import { makeContractCall, broadcastTransaction, AnchorMode, stringAsciiCV, uintCV } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error("❌ PRIVATE_KEY not set");
  process.exit(1);
}

const SENDER_KEY = PRIVATE_KEY as string;
const CONTRACT_ADDRESS = 'SPSHVWJVD3NP8G7ZM82KTHB91HKCMNTY3BKKNE5V';
const CONTRACT_NAME = 'predinex-pool-1765792183853';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createPool(title: string) {
  try {
    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'create-pool',
      functionArgs: [
        stringAsciiCV(title),
        stringAsciiCV("Test pool"),
        stringAsciiCV("Yes"),
        stringAsciiCV("No"),
        uintCV(500)
      ],
      senderKey: SENDER_KEY,
      network: STACKS_MAINNET,
      anchorMode: AnchorMode.Any,
      fee: 25000,
    };

    const transaction = await makeContractCall(txOptions);
    const response = await broadcastTransaction({ transaction, network: STACKS_MAINNET });

    if ('error' in response) {
      return { success: false, error: response.error };
    }

    return { success: true, txid: response.txid };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 FINAL ACTIVITY SCRIPT`);
  console.log(`${'='.repeat(60)}`);
  console.log(`📍 Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
  console.log(`💰 Fee: 25,000 microstacks`);
  console.log(`⏱️  Start: ${new Date().toLocaleTimeString()}\n`);

  const cycles = parseInt(process.argv[2] || '5');
  let success = 0;
  let failed = 0;

  const titles = [
    "Bitcoin $100k?",
    "Stacks $2?",
    "Ethereum $5k?",
    "Crypto $2T?",
    "NFT growth?",
    "DeFi TVL?",
    "Layer 2s?",
    "Web3 adoption?",
  ];

  for (let i = 0; i < cycles; i++) {
    const title = titles[i % titles.length];
    console.log(`[${i + 1}/${cycles}] Creating: "${title}"`);

    const result = await createPool(title);

    if (result.success) {
      console.log(`       ✅ Success - TX: ${result.txid?.substring(0, 16)}...`);
      success++;
    } else {
      console.log(`       ❌ Failed - ${result.error}`);
      failed++;
    }

    if (i < cycles - 1) {
      await sleep(1500);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Results: ${success} success, ${failed} failed`);
  console.log(`${'='.repeat(60)}\n`);
}

main().catch(console.error);

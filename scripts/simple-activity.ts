import { makeContractCall, broadcastTransaction, AnchorMode, stringAsciiCV, uintCV } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS || 'SPSHVWJVD3NP8G7ZM82KTHB91HKCMNTY3BKKNE5V';

if (!PRIVATE_KEY) {
  console.error("❌ Error: PRIVATE_KEY not set in .env");
  process.exit(1);
}

const SENDER_KEY = PRIVATE_KEY as string;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createPool(index: number) {
  const titles = [
    "Bitcoin $100k?",
    "Stacks $2?",
    "Ethereum $5k?",
    "Crypto $2T?",
    "NFT growth?",
  ];

  const title = titles[index % titles.length];

  try {
    console.log(`  📝 Creating: "${title}"`);

    const txOptions = {
      contractAddress: WALLET_ADDRESS,
      contractName: 'predinex-pool-1765876691340', // Use exact deployed name
      functionName: 'create-pool',
      functionArgs: [
        stringAsciiCV(title),
        stringAsciiCV("Prediction pool"),
        stringAsciiCV("Yes"),
        stringAsciiCV("No"),
        uintCV(500)
      ],
      senderKey: SENDER_KEY,
      network: STACKS_MAINNET,
      anchorMode: AnchorMode.Any,
      fee: 30000, // Very low fee
    };

    const transaction = await makeContractCall(txOptions);
    const response = await broadcastTransaction({ transaction, network: STACKS_MAINNET });

    if ('error' in response) {
      console.log(`     ❌ Error: ${response.error}`);
      return false;
    }

    console.log(`     ✅ TX: ${response.txid.substring(0, 16)}...`);
    return true;
  } catch (error: any) {
    console.log(`     ❌ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 SIMPLE ACTIVITY GENERATOR`);
  console.log(`${'='.repeat(60)}`);
  console.log(`📍 Wallet: ${WALLET_ADDRESS}`);
  console.log(`🔗 Contract: predinex-pool-1765792183853`);
  console.log(`💰 Fee: 30,000 microstacks per transaction`);
  console.log(`⏱️  Start: ${new Date().toLocaleTimeString()}\n`);

  const cycles = parseInt(process.argv[2] || '5');
  let success = 0;
  let failed = 0;

  for (let i = 0; i < cycles; i++) {
    console.log(`[${i + 1}/${cycles}]`);
    const result = await createPool(i);
    
    if (result) {
      success++;
    } else {
      failed++;
    }

    if (i < cycles - 1) {
      console.log(`  ⏳ Waiting 2 seconds...\n`);
      await sleep(2000);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ DONE`);
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${success + failed}`);
  console.log(`💰 Cost: ~${success * 0.03} STX`);
  console.log(`${'='.repeat(60)}\n`);
}

main().catch(console.error);

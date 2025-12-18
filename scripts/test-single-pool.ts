import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    uintCV,
    stringAsciiCV
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const CONTRACT_ADDRESS = process.env.WALLET_ADDRESS || 'SPSHVWJVD3NP8G7ZM82KTHB91HKCMNTY3BKKNE5V';
const CONTRACT_NAME = process.env.LATEST_CONTRACT_NAME || 'predinex-pool-1765876691340';

if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY required.");
    process.exit(1);
}

async function testSinglePool() {
    const network = STACKS_MAINNET;
    console.log(`🧪 Testing single pool creation...`);
    console.log(`📋 Contract: ${CONTRACT_NAME}`);
    console.log(`💰 Wallet: ${CONTRACT_ADDRESS}\n`);

    const createPoolArgs = [
        stringAsciiCV("Test Pool"),
        stringAsciiCV("Test description"),
        stringAsciiCV("Yes"),
        stringAsciiCV("No"),
        uintCV(10000)
    ];

    const createPoolTx = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'create-pool',
        functionArgs: createPoolArgs,
        senderKey: PRIVATE_KEY!,
        network,
        anchorMode: AnchorMode.Any,
        fee: 100000,
        postConditionMode: 0x01,
    };

    try {
        console.log("📝 Creating transaction...");
        const transaction = await makeContractCall(createPoolTx);
        console.log("✅ Transaction created");
        console.log(`   Nonce: ${(transaction as any).auth.spendingCondition.nonce.value}`);
        
        console.log("\n📤 Broadcasting...");
        const broadcastResponse = await broadcastTransaction({ transaction, network });

        console.log("\n📊 Response:");
        console.log(JSON.stringify(broadcastResponse, null, 2));

    } catch (err: any) {
        console.error(`❌ Error:`, err);
    }
}

testSinglePool();

import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    ClarityVersion,
    uintCV,
    stringAsciiCV,
    PostConditionMode,
    privateKeyToAddress
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

const PRIVATE_KEY = process.env.DEPLOYER_KEY;

if (!PRIVATE_KEY) {
    console.error("Error: DEPLOYER_KEY environment variable is required.");
    process.exit(1);
}

// Derive the contract address from the private key
const CONTRACT_ADDRESS = privateKeyToAddress(PRIVATE_KEY, 'mainnet');
const CONTRACT_NAME = 'predinex-pool-v5';

const network = STACKS_MAINNET;

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function registerUser() {
    console.log('📝 Calling register-user...');

    const txOptions = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'register-user',
        functionArgs: [],
        senderKey: PRIVATE_KEY!,
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        fee: 5000, // Low fee for read-like operations
    };

    try {
        const transaction = await makeContractCall(txOptions);
        const broadcastResponse = await broadcastTransaction({ transaction, network });

        if ('error' in broadcastResponse) {
            console.error('  ❌ Failed:', broadcastResponse.error);
            return null;
        }
        console.log('  ✅ TX:', broadcastResponse.txid);
        return broadcastResponse.txid;
    } catch (error) {
        console.error('  ❌ Error:', error);
        return null;
    }
}

async function createPool(index: number) {
    console.log(`🎲 Creating pool #${index}...`);

    const txOptions = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'create-pool',
        functionArgs: [
            stringAsciiCV(`Test Pool ${index} - Builder Challenge`),
            stringAsciiCV(`This is test pool ${index} for the Stacks Builder Challenge. Will BTC reach $100k?`),
            stringAsciiCV('Yes'),
            stringAsciiCV('No'),
            uintCV(1000) // Duration in blocks
        ],
        senderKey: PRIVATE_KEY!,
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        fee: 10000, // Higher fee for state-changing operations
    };

    try {
        const transaction = await makeContractCall(txOptions);
        const broadcastResponse = await broadcastTransaction({ transaction, network });

        if ('error' in broadcastResponse) {
            console.error('  ❌ Failed:', broadcastResponse.error);
            return null;
        }
        console.log('  ✅ TX:', broadcastResponse.txid);
        return broadcastResponse.txid;
    } catch (error) {
        console.error('  ❌ Error:', error);
        return null;
    }
}

async function main() {
    console.log('🚀 Starting contract interactions...');
    console.log(`📍 Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
    console.log('');

    const results: { action: string; txid: string | null }[] = [];

    // 1. Register user first
    const registerTx = await registerUser();
    results.push({ action: 'register-user', txid: registerTx });
    await sleep(3000); // Wait between transactions

    // 2. Create 10 prediction pools (generates good activity)
    for (let i = 1; i <= 10; i++) {
        const poolTx = await createPool(i);
        results.push({ action: `create-pool-${i}`, txid: poolTx });
        await sleep(3000); // Wait between transactions to avoid nonce issues
    }

    // 3. Register user again (will update timestamp)
    console.log('');
    console.log('📝 Additional register-user calls...');
    for (let i = 0; i < 9; i++) {
        const tx = await registerUser();
        results.push({ action: `register-user-${i + 2}`, txid: tx });
        await sleep(3000);
    }

    // Summary
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('📊 INTERACTION SUMMARY');
    console.log('═══════════════════════════════════════');

    const successful = results.filter(r => r.txid !== null);
    const failed = results.filter(r => r.txid === null);

    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    console.log('');

    if (successful.length > 0) {
        console.log('Transaction IDs:');
        successful.forEach((r, i) => {
            console.log(`  ${i + 1}. ${r.action}: ${r.txid}`);
        });
    }

    console.log('');
    console.log('🔗 View transactions at:');
    console.log(`   https://explorer.hiro.so/address/${CONTRACT_ADDRESS}.${CONTRACT_NAME}?chain=mainnet`);
}

main().catch(console.error);

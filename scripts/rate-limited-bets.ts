import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    uintCV,
    stringAsciiCV
} from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';

const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet';
const CONTRACT_ADDRESS = process.env.WALLET_ADDRESS || 'SPSHVWJVD3NP8G7ZM82KTHB91HKCMNTY3BKKNE5V';
const CONTRACT_NAME = process.env.LATEST_CONTRACT_NAME || 'predinex-pool-1765876691340';

if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY or DEPLOYER_KEY environment variable is required.");
    process.exit(1);
}

async function runRateLimitedBets() {
    const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
    console.log(`🎯 Rate-limited bulk betting on ${NETWORK_ENV}...`);
    console.log(`📋 Contract: ${CONTRACT_NAME}`);
    console.log(`💰 Wallet: ${CONTRACT_ADDRESS}\n`);

    let successCount = 0;
    let failCount = 0;

    // Step 1: Create a pool
    console.log("📦 Step 1: Creating prediction pool...");
    
    const createPoolArgs = [
        stringAsciiCV("Bitcoin Price Prediction"),
        stringAsciiCV("Will BTC reach $100k by end of 2025?"),
        stringAsciiCV("Yes"),
        stringAsciiCV("No"),
        uintCV(10000) // duration in blocks
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
        const transaction = await makeContractCall(createPoolTx);
        const broadcastResponse = await broadcastTransaction({ transaction, network });

        if ('error' in broadcastResponse) {
            console.error(`❌ Pool creation failed:`, broadcastResponse.error);
            process.exit(1);
        } else {
            console.log(`✅ Pool created! TX: ${broadcastResponse.txid}\n`);
            successCount++;
        }
    } catch (err) {
        console.error(`❌ Error creating pool:`, err);
        process.exit(1);
    }

    // Wait for pool to be confirmed
    console.log("⏳ Waiting 10 seconds for pool confirmation...\n");
    await new Promise(r => setTimeout(r, 10000));

    // Step 2: Place 100+ bets on pool 0
    console.log("🎲 Step 2: Placing 100+ bets on pool 0...\n");

    for (let i = 0; i < 100; i++) {
        const outcome = i % 2; // Alternate between outcome 0 and 1
        const amount = 100000 + (i * 1000); // Vary amounts slightly

        const placeBetArgs = [
            uintCV(0), // pool-id (always 0)
            uintCV(outcome), // outcome (0 or 1)
            uintCV(amount) // amount in microSTX
        ];

        const placeBetTx = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'place-bet',
            functionArgs: placeBetArgs,
            senderKey: PRIVATE_KEY!,
            network,
            anchorMode: AnchorMode.Any,
            fee: 100000,
            postConditionMode: 0x01,
        };

        try {
            const transaction = await makeContractCall(placeBetTx);
            const broadcastResponse = await broadcastTransaction({ transaction, network });

            if ('error' in broadcastResponse) {
                console.error(`❌ Bet ${i + 1}/100 failed:`, broadcastResponse.error);
                failCount++;
            } else {
                console.log(`✅ Bet ${i + 1}/100 placed! TX: ${broadcastResponse.txid}`);
                successCount++;
            }
        } catch (err: any) {
            const errorMsg = err.message || String(err);
            if (errorMsg.includes('429') || errorMsg.includes('rate limit')) {
                console.log(`⏳ Rate limited. Waiting 30 seconds before retry...`);
                await new Promise(r => setTimeout(r, 30000));
                // Retry this bet
                i--;
                continue;
            } else {
                console.error(`❌ Bet ${i + 1}/100 error:`, errorMsg);
                failCount++;
            }
        }

        // Adaptive delay: longer delays to respect rate limits
        const delay = (i + 1) % 5 === 0 ? 3000 : 1500; // Every 5th bet, wait 3 seconds
        await new Promise(r => setTimeout(r, delay));
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📈 Total activity generated: ${successCount} transactions`);
}

runRateLimitedBets();

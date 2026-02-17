import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    uintCV,
    stringAsciiCV,
    getNonce
} from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { StacksMainnet } from '@stacks/network';

const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet';
const CONTRACT_ADDRESS = process.env.WALLET_ADDRESS || 'SPENV2J0V4BHRFAZ6FVF97K9ZGQJ0GT19RC3JFN7';
const CONTRACT_NAME = process.env.LATEST_CONTRACT_NAME || 'predinex-pool-1765876691340';

if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY or DEPLOYER_KEY environment variable is required.");
    process.exit(1);
}

async function runSmartBulkBets() {
    const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
    console.log(`🎯 Smart bulk betting on ${NETWORK_ENV}...`);
    console.log(`📋 Contract: ${CONTRACT_NAME}`);
    console.log(`💰 Wallet: ${CONTRACT_ADDRESS}\n`);

    let successCount = 0;
    let failCount = 0;
    let currentNonce: number | null = null;

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
            // Get nonce from the transaction
            currentNonce = (transaction as any).auth.spendingCondition.nonce.value + 1;
        }
    } catch (err) {
        console.error(`❌ Error creating pool:`, err);
        process.exit(1);
    }

    // Wait longer for pool to be confirmed
    console.log("⏳ Waiting 5 seconds for pool confirmation...\n");
    await new Promise(r => setTimeout(r, 5000));

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
            nonce: currentNonce !== null ? uintCV(currentNonce) : undefined,
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
                // Increment nonce for next transaction
                if (currentNonce !== null) {
                    currentNonce++;
                }
            }
        } catch (err: any) {
            console.error(`❌ Bet ${i + 1}/100 error:`, err.message);
            failCount++;
            // If we get a nonce error, reset and let the next call fetch it
            if (err.message.includes('nonce')) {
                currentNonce = null;
            }
        }

        // Longer delay to respect rate limits
        const delay = i % 10 === 0 ? 2000 : 1000; // Every 10th bet, wait 2 seconds
        await new Promise(r => setTimeout(r, delay));
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📈 Total activity generated: ${successCount} transactions`);
}

runSmartBulkBets();

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

async function createPoolsOnly() {
    const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
    console.log(`🎯 Creating 50+ pools on ${NETWORK_ENV}...`);
    console.log(`📋 Contract: ${CONTRACT_NAME}`);
    console.log(`💰 Wallet: ${CONTRACT_ADDRESS}\n`);

    let successCount = 0;
    let failCount = 0;

    const topics = [
        "Bitcoin Price",
        "Ethereum Price",
        "Stacks Price",
        "Gold Price",
        "Oil Price",
        "Stock Market",
        "Tech Stocks",
        "Crypto Market",
        "Weather",
        "Sports",
        "Elections",
        "Interest Rates",
        "Inflation",
        "GDP Growth",
        "Unemployment",
        "Housing Market",
        "Crypto Adoption",
        "AI Development",
        "Climate Change",
        "Energy Prices"
    ];

    for (let i = 0; i < 50; i++) {
        const topic = topics[i % topics.length];
        const poolNum = i + 1;

        const createPoolArgs = [
            stringAsciiCV(`${topic} Prediction ${poolNum}`),
            stringAsciiCV(`Will ${topic} go up or down by end of 2025?`),
            stringAsciiCV("Up"),
            stringAsciiCV("Down"),
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
                console.error(`❌ Pool ${poolNum}/50 failed:`, broadcastResponse.error);
                failCount++;
            } else {
                console.log(`✅ Pool ${poolNum}/50 created! TX: ${broadcastResponse.txid}`);
                successCount++;
            }
        } catch (err: any) {
            const errorMsg = err.message || String(err);
            if (errorMsg.includes('429') || errorMsg.includes('rate limit')) {
                console.log(`⏳ Rate limited. Waiting 30 seconds...`);
                await new Promise(r => setTimeout(r, 30000));
                i--; // Retry this pool
                continue;
            } else {
                console.error(`❌ Pool ${poolNum}/50 error:`, errorMsg);
                failCount++;
            }
        }

        // Adaptive delay
        const delay = (i + 1) % 5 === 0 ? 2000 : 1000;
        await new Promise(r => setTimeout(r, delay));
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📈 Total pools created: ${successCount}`);
}

createPoolsOnly();

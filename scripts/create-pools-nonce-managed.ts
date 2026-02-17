import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    uintCV,
    stringAsciiCV,
    noneCV
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const CONTRACT_ADDRESS = process.env.WALLET_ADDRESS || 'SPENV2J0V4BHRFAZ6FVF97K9ZGQJ0GT19RC3JFN7';
const CONTRACT_NAME = process.env.LATEST_CONTRACT_NAME || 'predinex-pool-1765876691340';

if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY required.");
    process.exit(1);
}

async function createPoolsWithNonceManagement() {
    const network = STACKS_MAINNET;
    console.log(`🎯 Creating pools with manual nonce management...`);
    console.log(`📋 Contract: ${CONTRACT_NAME}\n`);

    let successCount = 0;
    let failCount = 0;
    let currentNonce = 118; // Start from current nonce

    const topics = [
        "Bitcoin", "Ethereum", "Stacks", "Gold", "Oil",
        "Tech Stocks", "Crypto", "Weather", "Sports", "Elections"
    ];

    for (let i = 0; i < 30; i++) {
        const topic = topics[i % topics.length];
        const poolNum = i + 1;

        const createPoolArgs = [
            stringAsciiCV(`${topic} Pool ${poolNum}`),
            stringAsciiCV(`${topic} prediction market`),
            stringAsciiCV("Up"),
            stringAsciiCV("Down"),
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
            nonce: currentNonce,
        };

        try {
            const transaction = await makeContractCall(createPoolTx);
            const broadcastResponse = await broadcastTransaction({ transaction, network });

            if ('error' in broadcastResponse) {
                console.error(`❌ Pool ${poolNum}/30 failed:`, broadcastResponse.error);
                failCount++;
            } else {
                console.log(`✅ Pool ${poolNum}/30 created! TX: ${broadcastResponse.txid}`);
                successCount++;
                currentNonce++; // Increment for next transaction
            }
        } catch (err: any) {
            console.error(`❌ Pool ${poolNum}/30 error:`, err.message);
            failCount++;
        }

        // Longer delay between requests
        await new Promise(r => setTimeout(r, 1500));
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
}

createPoolsWithNonceManagement();

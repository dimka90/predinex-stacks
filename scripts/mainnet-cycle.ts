import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    uintCV,
    stringAsciiCV,
    PostConditionMode
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import * as dotenv from 'dotenv';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = 'SPSHVWJVD3NP8G7ZM82KTHB91HKCMNTY3BKKNE5V';
const CONTRACT_NAME = 'predinex-pool-1766043971498';

if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY environment variable is required.");
    process.exit(1);
}

const action = process.argv[2]; // 'create', 'bet', or 'refund'
const poolIdArg = process.argv[3];

async function runMetricPulse() {
    console.log('\n🌟 Predinex Metric Pulse - Mainnet Edition');
    console.log(`📍 Network: Mainnet`);
    console.log(`📦 Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}\n`);

    if (action === 'create') {
        console.log('[1b/3] Action: Creating long-lived pool (nonce 719)...');
        const createTx = await makeContractCall({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'create-pool',
            functionArgs: [
                stringAsciiCV("Metric Pulse v2"),
                stringAsciiCV("Long-duration pulse for activity"),
                stringAsciiCV("Yes"),
                stringAsciiCV("No"),
                uintCV(144) // ~24h duration
            ],
            senderKey: PRIVATE_KEY as string,
            network: STACKS_MAINNET,
            // @ts-ignore
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
            fee: 10000,
            nonce: 719,
        } as any);
        const result = await broadcastTransaction({ transaction: createTx, network: STACKS_MAINNET });
        console.log(result);
    } else if (action === 'bet') {
        if (!poolIdArg) { console.error("Error: pool-id required for bet"); return; }
        console.log(`[2/3] Action: Placing 0.1 STX bet on Pool ${poolIdArg}...`);
        const betTx = await makeContractCall({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'place-bet',
            functionArgs: [
                uintCV(parseInt(poolIdArg)),
                uintCV(0), // outcome A
                uintCV(100000) // 0.1 STX
            ],
            senderKey: PRIVATE_KEY as string,
            network: STACKS_MAINNET,
            // @ts-ignore
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
            fee: 10000,
            nonce: 720,
        } as any);
        console.log('SIGNED_TX_HEX:', betTx.serialize());
    }

    else if (action === 'refund') {
        if (!poolIdArg) { console.error("Error: pool-id required for refund"); return; }
        console.log(`[3/3] Action: Requesting refund for Expired Pool ${poolIdArg}...`);
        const refundTx = await makeContractCall({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'request-refund',
            functionArgs: [uintCV(parseInt(poolIdArg))],
            senderKey: PRIVATE_KEY as string,
            network: STACKS_MAINNET,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
            fee: 10000,
        });

        const result = await broadcastTransaction({ transaction: refundTx, network: STACKS_MAINNET });
        console.log(result);
    } else {
        console.log("Usage: npx ts-node scripts/mainnet-cycle.ts [create|bet <id>|refund <id>]");
    }
}

runMetricPulse().catch(console.error);


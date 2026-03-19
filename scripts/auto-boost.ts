import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    PostConditionMode
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import * as dotenv from 'dotenv';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N'; // User address
const CONTRACT_NAME = 'metric-booster-v2';


if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY environment variable is required.");
    process.exit(1);
}

async function autoBoost(count: number, startNonce: number) {
    console.log(`\n⚡ Automating ${count} Pulse transactions starting from nonce ${startNonce}...`);

    for (let i = 0; i < count; i++) {
        const currentNonce = startNonce + i;
        console.log(`[${i + 1}/${count}] Pulsing with nonce ${currentNonce}...`);

        try {
            const tx = await makeContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'pulse',
                functionArgs: [],
                senderKey: PRIVATE_KEY as string,
                network: STACKS_MAINNET,
                anchorMode: AnchorMode.Any,
                postConditionMode: PostConditionMode.Allow,
                fee: 10000, // 0.01 STX
                nonce: currentNonce,
            } as any);

            const result = await broadcastTransaction({ transaction: tx, network: STACKS_MAINNET });
            console.log(`   TX: ${'txid' in result ? result.txid : JSON.stringify(result)}`);

            // Short delay to avoid rate limiting or overlap
            await new Promise(r => setTimeout(r, 2000));
        } catch (e) {
            console.error(`   ❌ Failed:`, e);
        }
    }
}

// Usage: npx tsx scripts/auto-boost.ts <count> <startNonce>
const count = parseInt(process.argv[2]) || 5;
const startNonce = parseInt(process.argv[3]);

if (!startNonce) {
    console.error("Error: startNonce required.");
    process.exit(1);
}

autoBoost(count, startNonce).catch(console.error);


import { getAddressFromPrivateKey } from '@stacks/transactions';
import { makeContractCall, broadcastTransaction, AnchorMode, stringAsciiCV, uintCV, PostConditionMode } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

// --- CONFIGURATION ---
const CONTRACT_ADDRESS = 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';
const CONTRACT_NAME = 'predinex-pool-1769575549853';
const ENV_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;

if (!ENV_KEY) {
    console.error("Please export PRIVATE_KEY or DEPLOYER_KEY");
    process.exit(1);
}

const network = STACKS_MAINNET;
const senderKey = ENV_KEY;

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Robust fetch helper
async function fetchWithRetry(url: string, options?: any, retries = 5) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url, options);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res;
        } catch (err: any) {
            console.log(`   ⚠️ Connection failed. Retrying... (${err.message})`);
            await sleep(2000);
        }
    }
    throw new Error("Max retries reached");
}

async function main() {
    console.log(`=== SIMPLE GENERATOR: 50 POOLS (ROBUST) ===`);
    console.log(`Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);

    // 1. Get Initial Nonce
    const senderAddress = getAddressFromPrivateKey(senderKey, network.version);
    const apiUrl = network.coreApiUrl || 'https://api.hiro.so';

    let nonce;
    try {
        console.log(`Fetching Nonce for ${senderAddress}...`);
        const response = await fetchWithRetry(`${apiUrl}/v2/accounts/${senderAddress}`);
        const accountData = await response.json();
        nonce = BigInt(accountData.nonce);
        console.log(`Starting Activity from Nonce: ${nonce}`);
    } catch (e) {
        console.error("❌ Failed to fetch nonce. Network down?");
        process.exit(1);
    }

    // 2. Loop 50 times
    for (let i = 1; i <= 50; i++) {
        const title = `Activity Gen #${i} - ${Date.now()}`;
        console.log(`[${i}/50] Broadcasting 'create-pool' (Nonce ${nonce})`);

        const txOptions = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'create-pool',
            functionArgs: [
                stringAsciiCV(title),
                stringAsciiCV("Activity Generation Pool"),
                stringAsciiCV("Yes"),
                stringAsciiCV("No"),
                uintCV(144)
            ],
            senderKey: senderKey,
            network,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
            fee: 50000,
            nonce: nonce
        };

        // Retry loop for BROADCASTING this specific nonce
        let broadcasted = false;
        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                const transaction = await makeContractCall(txOptions);
                const broadcastResponse = await broadcastTransaction({ transaction, network });

                if ('error' in broadcastResponse) {
                    console.error(`   ❌ Node Rejected: ${broadcastResponse.error}`);
                    // If rejected by node (e.g. Bad Nonce), retrying won't help unless we change nonce.
                    // But assume we want to skip this iteration to avoid stuck loop?
                    // Actually, if we get BadNonce, we might need to refresh nonce? 
                    // For now, break loop and try next iteration (which effectively re-uses nonce if we allow it, but we increment inside loop?)
                    // Let's just break and increment nonce to move on.
                    break;
                } else {
                    console.log(`   ✅ Sent: ${broadcastResponse.txid}`);
                    broadcasted = true;
                    nonce++; // Success! Increment nonce.
                    break;
                }
            } catch (e: any) {
                console.error(`   ⚠️ Network Error (Attempt ${attempt + 1}/5): ${e.message}`);
                await sleep(2000);
            }
        }

        if (!broadcasted) {
            // If we failed 5 times or got rejected, we SHOULD increment nonce to avoid getting stuck on a bad state?
            // Or we simply try the next loop iteration with the SAME nonce to fill the gap?
            // User wants 50 txs. If we skip nonce increment, next loop uses same nonce.
            // If we force increment, we might leave a gap?
            // Safest manual strategy: Try next loop with SAME nonce (don't increment).
            console.log(`   ⚠️ Failed to broadcast step ${i}. Retrying with same nonce...`);
        }

        await sleep(500);
    }
}

main();

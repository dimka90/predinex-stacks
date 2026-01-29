
import { makeContractCall, broadcastTransaction, AnchorMode, principalCV, PostConditionMode } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

const DEPLOYER_ADDR = 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';
const INCENTIVES_CONTRACT = 'liquidity-incentives-1769574671620';
const POOL_CONTRACT = 'predinex-pool-1769575549853';

const ENV_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
if (!ENV_KEY) process.exit(1);

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, options?: any, retries = 10) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url, options);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res;
        } catch (err) {
            console.log(`Connection failed (${i + 1}/${retries}). Retrying in 2s...`);
            await sleep(2000);
        }
    }
    throw new Error("Max retries reached");
}

async function main() {
    console.log("Authorizing Pool Contract on Liquidity Incentives...");

    // Get sender nonce with retry
    const apiUrl = STACKS_MAINNET.coreApiUrl || 'https://api.hiro.so';
    console.log(`Fetching nonce from ${apiUrl}...`);

    let nonce;
    try {
        const nonceRes = await fetchWithRetry(`${apiUrl}/v2/accounts/${DEPLOYER_ADDR}`);
        const nonceData = await nonceRes.json();
        nonce = BigInt(nonceData.nonce);
        console.log(`Current Nonce: ${nonce}`);
    } catch (e) {
        console.error("Failed to fetch nonce. Is network down?");
        process.exit(1);
    }

    const txOptions = {
        contractAddress: DEPLOYER_ADDR,
        contractName: INCENTIVES_CONTRACT,
        functionName: 'set-authorized-contract',
        functionArgs: [
            principalCV(`${DEPLOYER_ADDR}.${POOL_CONTRACT}`)
        ],
        senderKey: ENV_KEY,
        network: STACKS_MAINNET,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        nonce: nonce,
        fee: 100000
    };

    console.log("Signing and Broadcasting...");

    try {
        const transaction = await makeContractCall(txOptions);
        // We can't easily hook into the internal fetch of broadcastTransaction, 
        // but it usually throws if network fails. We can wrap the whole call in a retry loop if needed,
        // but 'makeContractCall' is offline (mostly), 'broadcastTransaction' is online.

        // Manual broadcast retry loop
        let broadcastSuccess = false;
        for (let i = 0; i < 10; i++) {
            try {
                const result = await broadcastTransaction({ transaction, network: STACKS_MAINNET });
                if ('error' in result) {
                    console.error("Broadcast Rejected/Error:", result.error);
                    // If error is actual rejection (not network), stop.
                    // But if it's network related disguised? Stacks lib returns string error usually.
                    // We assume if we got a response, it's not a timeout.
                    break;
                }
                console.log("✅ Broadcast Success! TXID:", result.txid);
                broadcastSuccess = true;
                break;
            } catch (err: any) {
                console.log(`Broadcast network error (${i + 1}/10). Retrying...`, err.message);
                await sleep(2000);
            }
        }
    } catch (e) {
        console.error("Transaction construction failed:", e);
    }
}

main();

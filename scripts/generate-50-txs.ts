
import { getAddressFromPrivateKey } from '@stacks/transactions';
import { makeContractCall, broadcastTransaction, AnchorMode, stringAsciiCV, uintCV, PostConditionMode } from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';

// --- CONFIGURATION ---
const TARGET_TX_COUNT = 50;
const CONTRACT_ADDRESS_DEPLOYER = 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';
const CONTRACT_NAME = 'predinex-pool-1769575549853';

// Use the private key from environment
const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet';

if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY or DEPLOYER_KEY environment variable is required.");
    process.exit(1);
}

const SENDER_KEY = PRIVATE_KEY as string;
const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
const networkName = NETWORK_ENV === 'mainnet' ? 'Mainnet' : 'Testnet';

// Delay helper
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Templates for random pools
const templates = [
    { t: "Will BTC hit 150k?", d: "End of 2025", a: "Yes", b: "No" },
    { t: "Will ETH hit 10k?", d: "End of Q4", a: "Yes", b: "No" },
    { t: "Will STX hit 5.0?", d: "Nakamoto release", a: "Yes", b: "No" },
    { t: "Will SOL flip ETH?", d: "Volume checks", a: "Yes", b: "No" },
    { t: "Next US President?", d: "2028 election", a: "Rep", b: "Dem" }
];

async function createPool(iteration: number, nonce: bigint) {
    const tmpl = templates[iteration % templates.length];
    const title = `${tmpl.t} #${Math.floor(Math.random() * 10000)}`;

    console.log(`[${iteration}] Creating pool: ${title} (Nonce: ${nonce})`);

    const txOptions = {
        contractAddress: CONTRACT_ADDRESS_DEPLOYER,
        contractName: CONTRACT_NAME,
        functionName: 'create-pool',
        functionArgs: [
            stringAsciiCV(title),
            stringAsciiCV(tmpl.d),
            stringAsciiCV(tmpl.a),
            stringAsciiCV(tmpl.b),
            uintCV(144)
        ],
        senderKey: SENDER_KEY,
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        fee: 50000,
        nonce: nonce // Manual nonce
    };

    const transaction = await makeContractCall(txOptions);
    const response = await broadcastTransaction({ transaction, network });

    if ('error' in response) {
        console.log(`CREATE ERROR:`, JSON.stringify(response, null, 2));
        return null; // Return null if failed
    }
    return response.txid;
}

async function placeBet(poolId: number, outcome: number, amount: number, nonce: bigint) {
    console.log(`[Bet] Pool ${poolId}, Outcome ${outcome} (Nonce: ${nonce})`);

    const txOptions = {
        contractAddress: CONTRACT_ADDRESS_DEPLOYER,
        contractName: CONTRACT_NAME,
        functionName: 'place-bet',
        functionArgs: [
            uintCV(poolId),
            uintCV(outcome),
            uintCV(amount)
        ],
        senderKey: SENDER_KEY,
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        fee: 30000,
        nonce: nonce // Manual nonce
    };

    const transaction = await makeContractCall(txOptions);
    const response = await broadcastTransaction({ transaction, network });

    if ('error' in response) {
        console.log(`BET ERROR:`, JSON.stringify(response, null, 2));
        if ('txid' in response) return response.txid;
        return null;
    }
    return response.txid;
}

async function settlePool(poolId: number, winner: number, nonce: bigint) {
    console.log(`[Settle] Pool ${poolId} with winner ${winner} (Nonce: ${nonce})`);

    const txOptions = {
        contractAddress: CONTRACT_ADDRESS_DEPLOYER,
        contractName: CONTRACT_NAME,
        functionName: 'settle-pool',
        functionArgs: [
            uintCV(poolId),
            uintCV(winner)
        ],
        senderKey: SENDER_KEY,
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        fee: 50000,
        nonce: nonce // Manual nonce
    };

    const transaction = await makeContractCall(txOptions);
    const response = await broadcastTransaction({ transaction, network });

    if ('error' in response) {
        console.log(`SETTLE ERROR:`, JSON.stringify(response, null, 2));
        if ('txid' in response) return response.txid;
        return null;
    }
    return response.txid;
}

async function claimWinnings(poolId: number, nonce: bigint) {
    console.log(`[Claim] Pool ${poolId} winnings (Nonce: ${nonce})`);

    const txOptions = {
        contractAddress: CONTRACT_ADDRESS_DEPLOYER,
        contractName: CONTRACT_NAME,
        functionName: 'claim-winnings',
        functionArgs: [
            uintCV(poolId)
        ],
        senderKey: SENDER_KEY,
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        fee: 40000,
        nonce: nonce // Manual nonce
    };

    const transaction = await makeContractCall(txOptions);
    const response = await broadcastTransaction({ transaction, network });

    if ('error' in response) {
        console.log(`CLAIM ERROR:`, JSON.stringify(response, null, 2));
        if ('txid' in response) return response.txid;
        return null;
    }
    return response.txid;
}

async function main() {
    console.log(`=== PREDINEX GENERATOR: 50 TXs MANUAL NONCE MODE ===`);
    console.log(`Target: ${CONTRACT_ADDRESS_DEPLOYER}.${CONTRACT_NAME}`);

    // Initial nonce fetch
    const senderAddress = getAddressFromPrivateKey(SENDER_KEY, network.version);
    const apiUrl = network.coreApiUrl || 'https://api.hiro.so';
    console.log(`Fetching nonce for ${senderAddress}...`);

    // Manual fetch since fetchNonce is tricky to import sometimes
    const response = await fetch(`${apiUrl}/v2/accounts/${senderAddress}`);
    const accountData = await response.json();
    let currentNonce = BigInt(accountData.nonce);

    console.log(`Starting Nonce: ${currentNonce}`);

    let txCount = 0;
    let estimatedPoolId = 1;

    for (let i = 0; i < 10; i++) {
        try {
            console.log(`\n--- Cycle ${i + 1}/10 (Est. Pool ID: ${estimatedPoolId}) ---`);

            // 1. Create Pool
            const tx1 = await createPool(i, currentNonce);
            // Increment nonce regardless of success (if it was broadcasted, it consumes nonce)
            // But if it failed locally (e.g. timeout), maybe not?
            // If it returned a txid, it's broadcasted.
            if (tx1) { txCount++; currentNonce++; }
            await sleep(500); // Minimal sleep

            // 2. Place Bet outcome 0
            const tx2 = await placeBet(estimatedPoolId, 0, 10000, currentNonce);
            if (tx2) { txCount++; currentNonce++; }
            await sleep(500);

            // 3. Place Bet outcome 1
            const tx3 = await placeBet(estimatedPoolId, 1, 10000, currentNonce);
            if (tx3) { txCount++; currentNonce++; }
            await sleep(500);

            // 4. Settle Pool
            const tx4 = await settlePool(estimatedPoolId, 0, currentNonce);
            if (tx4) { txCount++; currentNonce++; }
            await sleep(500);

            // 5. Claim Winnings
            const tx5 = await claimWinnings(estimatedPoolId, currentNonce);
            if (tx5) { txCount++; currentNonce++; }
            await sleep(500);

            estimatedPoolId++;
        } catch (err) {
            console.error(`❌ Cycle ${i + 1} interrupted:`, err);
            await sleep(2000);
            // If network error, we probably didn't increment nonce. 
            // This is tricky. But manual nonce is safer for burst.
        }
    }

    console.log(`\n=== DONE ===`);
    console.log(`Generated roughly ${txCount} transactions.`);
}

main().catch(console.error);

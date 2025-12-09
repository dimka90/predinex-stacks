import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    uintCV,
    stringAsciiCV
} from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';

const PRIVATE_KEY = process.env.DEPLOYER_KEY;
const NETWORK_ENV = process.env.STACKS_NETWORK || 'testnet';
// The address provided by the user as the contract deployer
const CONTRACT_ADDRESS = 'STSHVWJVD3NP8G7ZM82KTHB91HKCMNTY38BY9FYG';
const CONTRACT_NAME = 'predinex-pool';

if (!PRIVATE_KEY) {
    console.error("Error: DEPLOYER_KEY environment variable is required.");
    process.exit(1);
}

async function runInteractions() {
    const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
    console.log(`Running interactions on ${NETWORK_ENV}...`);

    // 1. Get current nonce from the network for the sender
    // We need to derive the sender address from the private key, but for now 
    // relying on the API to tell us the next nonce for the address associated with the key is safer 
    // if we had the address. 
    // However, makeContractCall can fetch it efficiently if we don't pass it.
    // BUT, to fire 20 txs in a row, we MUST manage nonce locally.

    // We'll use a fetch to get the nonce first.
    // We need the sender address. 
    // Since we don't want to import c32check or big deps just for that, 
    // we can do a "dry run" or just let the first one fetch it, then increment.
    // Actually, @stacks/transactions getAddressFromPrivateKey is available? 
    // Let's assume we can get it or just make one call and read the nonce property? 
    // No, easiest is to get it from the API.

    // Let's assume the user puts their address in env or we just let properly sequential await.
    // User said "like 20 times", assuming they want it fast? Or just done.
    // If we await each broadcast, it's fast enough (submission is fast).
    // The nonce problem: if the first tx is in mempool, the second one might need nonce+1.
    // The library defaults to fetching "confirmed" nonce? Or "possible next" nonce?
    // Usually it fetches from node. Node tracks mempool.
    // So sequential await might work if node updates mempool state quickly.
    // Let's try sequential await first.

    for (let i = 0; i < 20; i++) {
        console.log(`\n-- - Interaction ${i + 1}/20 ---`);

        // We will place a bet on pool 0.
        // If pool 0 doesn't exist, this fails. 
        // Ideally we'd ensure pool exists. 
        // Let's try to create a pool first on iteration 0?
        // User asked to interact with contract.

        // Changing strategy: 
        // Iteration 0: Create Pool (if i==0)
        // Iteration 1-19: Place Bet

        const functionName = i === 0 ? 'create-pool' : 'place-bet';
        const functionArgs = i === 0
            ? [
                stringAsciiCV("Bitcoin to 100k"),
                stringAsciiCV("Will BTC hit 100k by EOY?"),
                stringAsciiCV("Yes"),
                stringAsciiCV("No")
            ]
            : [
                uintCV(0), // pool-id
                uintCV(i % 2), // random outcome 0 or 1
                uintCV(1000000) // amount
            ];

        const txOptions = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName,
            functionArgs,
            senderKey: PRIVATE_KEY!,
            network,
            anchorMode: AnchorMode.Any,
            fee: 100000,
            postConditionMode: 0x01, // Allow
        };

        try {
            // @ts-ignore - The types might infer nonce management automatically
            const transaction = await makeContractCall(txOptions);

            const broadcastResponse = await broadcastTransaction({ transaction, network });

            if ('error' in broadcastResponse) {
                console.error(`Tx ${i} failed:`, broadcastResponse.error);
                if (broadcastResponse.reason === 'BadNonce') {
                    console.log("Retrying is needed for BadNonce...");
                }
            } else {
                console.log(`Tx ${i} submitted! ID: ${broadcastResponse.txid}`);
            }

            // Small delay to be nice to the API
            await new Promise(r => setTimeout(r, 500));

        } catch (err) {
            console.error(`Tx ${i} Error:`, err);
        }
    }
}

runInteractions();

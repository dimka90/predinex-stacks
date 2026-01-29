import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    uintCV,
    stringAsciiCV,
    getNonce
} from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import fetch from 'node-fetch';

const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet';
const CONTRACT_ADDRESS = process.env.WALLET_ADDRESS || 'SPSHVWJVD3NP8G7ZM82KTHB91HKCMNTY3BKKNE5V';
const CONTRACT_NAME = process.env.LATEST_CONTRACT_NAME || 'predinex-pool-1766043971498';

if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY environment variable is required.");
    process.exit(1);
}

// Get current nonce from API
async function getCurrentNonce(address: string, network: any): Promise<number> {
    try {
        const apiUrl = network.coreApiUrl || 'https://api.mainnet.hiro.so';
        const response = await fetch(`${apiUrl}/v2/accounts/${address}?proof=0`);
        const data: any = await response.json();
        return data.nonce || 0;
    } catch (error) {
        console.error('Error fetching nonce:', error);
        return 0;
    }
}

async function runInteractions() {
    const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
    console.log(`Running interactions on ${NETWORK_ENV}...`);
    console.log(`Sending 50 transactions with proper nonce management...`);

    const TOTAL_TXS = 50; // Reduced to 50 to save STX
    const LOW_FEE = 150000; // 0.0015 STX per tx = 0.075 STX for 50 txs
    const DELAY_MS = 3000; // 3 second delay between transactions

    let currentNonce = await getCurrentNonce(CONTRACT_ADDRESS, network);
    console.log(`Starting nonce: ${currentNonce}\n`);

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < TOTAL_TXS; i++) {
        console.log(`\n--- Tx ${i + 1}/${TOTAL_TXS} (Nonce: ${currentNonce}) ---`);

        const functionName = 'create-pool';

        const functionArgs = [
            stringAsciiCV(`Pool ${i}`),
            stringAsciiCV(`Test pool ${i}`),
            stringAsciiCV("Yes"),
            stringAsciiCV("No"),
            uintCV(1000)
        ];

        const txOptions = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName,
            functionArgs,
            senderKey: PRIVATE_KEY!,
            network,
            anchorMode: AnchorMode.Any,
            fee: LOW_FEE,
            postConditionMode: 0x01,
            nonce: currentNonce, // Explicitly set nonce
        };

        try {
            const transaction = await makeContractCall(txOptions);
            const broadcastResponse = await broadcastTransaction({ transaction, network });

            if ('error' in broadcastResponse) {
                console.error(`❌ Tx ${i} failed:`, broadcastResponse.error);
                failureCount++;
            } else {
                console.log(`✅ Tx ${i} submitted! ID: ${broadcastResponse.txid}`);
                successCount++;
                currentNonce++; // Increment nonce on success
            }

            // Wait before next transaction
            if (i < TOTAL_TXS - 1) {
                console.log(`⏳ Waiting ${DELAY_MS}ms before next transaction...`);
                await new Promise(r => setTimeout(r, DELAY_MS));
            }

        } catch (err: any) {
            console.error(`❌ Tx ${i} Error:`, err.message);
            failureCount++;

            // If nonce error, fetch fresh nonce
            if (err.message?.includes('nonce')) {
                console.log('🔄 Nonce conflict detected, fetching fresh nonce...');
                currentNonce = await getCurrentNonce(CONTRACT_ADDRESS, network);
            }
        }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✓ Completed ${TOTAL_TXS} transactions!`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failureCount}`);
    console.log(`Success Rate: ${((successCount / TOTAL_TXS) * 100).toFixed(1)}%`);
    console.log(`Estimated Cost: ${(LOW_FEE * successCount / 1_000_000).toFixed(4)} STX`);
    console.log(`${'='.repeat(60)}\n`);
}

runInteractions().catch(console.error);

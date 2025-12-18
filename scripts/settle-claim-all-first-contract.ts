import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    uintCV
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const CONTRACT_ADDRESS = process.env.WALLET_ADDRESS || 'SPSHVWJVD3NP8G7ZM82KTHB91HKCMNTY3BKKNE5V';
const CONTRACT_NAME = 'predinex-pool-1766043971498'; // First contract

if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY required.");
    process.exit(1);
}

async function settleClaimAll() {
    const network = STACKS_MAINNET;
    console.log(`🎯 Settling and claiming from FIRST contract...`);
    console.log(`📋 Contract: ${CONTRACT_NAME}`);
    console.log(`💼 Wallet: ${CONTRACT_ADDRESS}\n`);

    let settleSuccess = 0;
    let claimSuccess = 0;
    let failCount = 0;

    // All pools 0-23
    const allPools = Array.from({ length: 24 }, (_, i) => i);

    // Step 1: Settle all pools
    console.log("Step 1: Settling all pools...\n");
    for (const poolId of allPools) {
        const settleArgs = [
            uintCV(poolId),
            uintCV(0) // winning outcome
        ];

        const settleTx = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'settle-pool',
            functionArgs: settleArgs,
            senderKey: PRIVATE_KEY!,
            network,
            anchorMode: AnchorMode.Any,
            fee: 100000,
            postConditionMode: 0x01,
        };

        try {
            const transaction = await makeContractCall(settleTx);
            const broadcastResponse = await broadcastTransaction({ transaction, network });

            if ('error' in broadcastResponse) {
                console.error(`❌ Settle pool ${poolId} failed:`, broadcastResponse.error);
                failCount++;
            } else {
                console.log(`✅ Pool ${poolId} settled! TX: ${broadcastResponse.txid}`);
                settleSuccess++;
            }
        } catch (err: any) {
            console.error(`❌ Settle pool ${poolId} error:`, err.message);
            failCount++;
        }

        await new Promise(r => setTimeout(r, 800));
    }

    // Step 2: Claim from all pools
    console.log("\nStep 2: Claiming from all pools...\n");
    for (const poolId of allPools) {
        const claimArgs = [
            uintCV(poolId)
        ];

        const claimTx = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'claim-winnings',
            functionArgs: claimArgs,
            senderKey: PRIVATE_KEY!,
            network,
            anchorMode: AnchorMode.Any,
            fee: 100000,
            postConditionMode: 0x01,
        };

        try {
            const transaction = await makeContractCall(claimTx);
            const broadcastResponse = await broadcastTransaction({ transaction, network });

            if ('error' in broadcastResponse) {
                console.error(`❌ Claim pool ${poolId} failed:`, broadcastResponse.error);
                failCount++;
            } else {
                console.log(`✅ Claimed from pool ${poolId}! TX: ${broadcastResponse.txid}`);
                claimSuccess++;
            }
        } catch (err: any) {
            console.error(`❌ Claim pool ${poolId} error:`, err.message);
            failCount++;
        }

        await new Promise(r => setTimeout(r, 800));
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Pools settled: ${settleSuccess}`);
    console.log(`✅ Successful claims: ${claimSuccess}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📈 Total transactions: ${settleSuccess + claimSuccess}`);
}

settleClaimAll();

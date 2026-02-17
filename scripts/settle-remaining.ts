import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    uintCV
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const CONTRACT_ADDRESS = process.env.WALLET_ADDRESS || 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';
const CONTRACT_NAME = process.env.LATEST_CONTRACT_NAME || 'predinex-pool-1766043971498';

if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY required.");
    process.exit(1);
}

async function settleRemaining() {
    const network = STACKS_MAINNET;
    console.log(`🎯 Settling remaining pools...`);
    console.log(`📋 Contract: ${CONTRACT_NAME}\n`);

    let settleSuccess = 0;
    let claimSuccess = 0;
    let failCount = 0;

    // Remaining pools: 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23
    const remainingPools = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23];

    // Step 1: Settle all remaining pools
    console.log("Step 1: Settling pools...\n");
    for (const poolId of remainingPools) {
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

        await new Promise(r => setTimeout(r, 1000));
    }

    // Step 2: Claim from settled pools
    console.log("\nStep 2: Claiming winnings...\n");
    for (const poolId of remainingPools) {
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

        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Pools settled: ${settleSuccess}`);
    console.log(`✅ Successful claims: ${claimSuccess}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📈 Total transactions: ${settleSuccess + claimSuccess}`);
}

settleRemaining();

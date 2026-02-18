import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    uintCV
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const CONTRACT_ADDRESS = process.env.WALLET_ADDRESS || 'SPENV2J0V4BHRFAZ6FVF97K9ZGQJ0GT19RC3JFN7';
const CONTRACT_NAME = process.env.LATEST_CONTRACT_NAME || 'predinex-pool-1766043971498';

if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY required.");
    process.exit(1);
}

async function settleAndClaim() {
    const network = STACKS_MAINNET;
    console.log(`🎯 Settling pools and claiming winnings...`);
    console.log(`📋 Contract: ${CONTRACT_NAME}`);
    console.log(`💼 Wallet: ${CONTRACT_ADDRESS}\n`);

    let settleSuccess = 0;
    let claimSuccess = 0;
    let failCount = 0;

    // Settle pools 0-23
    const poolsToSettle = Array.from({ length: 24 }, (_, i) => i);

    for (const poolId of poolsToSettle) {
        // Step 1: Settle the pool (outcome 0)
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
            console.log(`🔄 Settling pool ${poolId}...`);
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

    console.log(`\n📊 Summary:`);
    console.log(`✅ Pools settled: ${settleSuccess}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📈 Total settlement transactions: ${settleSuccess}`);
}

settleAndClaim();

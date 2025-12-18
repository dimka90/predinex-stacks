import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    uintCV
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const CONTRACT_ADDRESS = process.env.WALLET_ADDRESS || 'SPSHVWJVD3NP8G7ZM82KTHB91HKCMNTY3BKKNE5V';
const CONTRACT_NAME = process.env.LATEST_CONTRACT_NAME || 'predinex-pool-1766043971498';

if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY required.");
    process.exit(1);
}

async function refundBets() {
    const network = STACKS_MAINNET;
    console.log(`💰 Refunding bets...`);
    console.log(`📋 Contract: ${CONTRACT_NAME}`);
    console.log(`💼 Wallet: ${CONTRACT_ADDRESS}\n`);

    let successCount = 0;
    let failCount = 0;

    // Refund from pools 0-23 (24 pools were created)
    // Each pool had bets placed on it
    const poolsToRefund = Array.from({ length: 24 }, (_, i) => i);
    const refundAmount = 100000; // 0.1 STX per refund

    for (const poolId of poolsToRefund) {
        const refundArgs = [
            uintCV(poolId),
            uintCV(refundAmount)
        ];

        const refundTx = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'refund-bet',
            functionArgs: refundArgs,
            senderKey: PRIVATE_KEY!,
            network,
            anchorMode: AnchorMode.Any,
            fee: 100000,
            postConditionMode: 0x01,
        };

        try {
            console.log(`🔄 Refunding from pool ${poolId}...`);
            const transaction = await makeContractCall(refundTx);
            const broadcastResponse = await broadcastTransaction({ transaction, network });

            if ('error' in broadcastResponse) {
                console.error(`❌ Refund pool ${poolId} failed:`, broadcastResponse.error);
                failCount++;
            } else {
                console.log(`✅ Refund pool ${poolId} successful! TX: ${broadcastResponse.txid}`);
                successCount++;
            }
        } catch (err: any) {
            console.error(`❌ Refund pool ${poolId} error:`, err.message);
            failCount++;
        }

        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successful refunds: ${successCount}`);
    console.log(`❌ Failed refunds: ${failCount}`);
    console.log(`💵 Total refunded: ${successCount * refundAmount} microSTX (${(successCount * refundAmount / 1000000).toFixed(6)} STX)`);
}

refundBets();

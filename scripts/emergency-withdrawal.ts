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

async function emergencyWithdrawal() {
    const network = STACKS_MAINNET;
    console.log(`🚨 Emergency Withdrawal...`);
    console.log(`📋 Contract: ${CONTRACT_NAME}`);
    console.log(`💼 Wallet: ${CONTRACT_ADDRESS}\n`);

    let successCount = 0;
    let failCount = 0;

    // Emergency withdrawal from pools 0-23 (24 pools were created)
    // Only pool creator can call this
    const poolsToWithdraw = Array.from({ length: 24 }, (_, i) => i);

    for (const poolId of poolsToWithdraw) {
        const emergencyArgs = [
            uintCV(poolId)
        ];

        const emergencyTx = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'emergency-withdrawal',
            functionArgs: emergencyArgs,
            senderKey: PRIVATE_KEY!,
            network,
            anchorMode: AnchorMode.Any,
            fee: 100000,
            postConditionMode: 0x01,
        };

        try {
            console.log(`🔄 Emergency withdrawal from pool ${poolId}...`);
            const transaction = await makeContractCall(emergencyTx);
            const broadcastResponse = await broadcastTransaction({ transaction, network });

            if ('error' in broadcastResponse) {
                console.error(`❌ Pool ${poolId} failed:`, broadcastResponse.error);
                failCount++;
            } else {
                console.log(`✅ Pool ${poolId} successful! TX: ${broadcastResponse.txid}`);
                successCount++;
            }
        } catch (err: any) {
            console.error(`❌ Pool ${poolId} error:`, err.message);
            failCount++;
        }

        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successful withdrawals: ${successCount}`);
    console.log(`❌ Failed withdrawals: ${failCount}`);
    console.log(`📈 Total emergency withdrawals: ${successCount}`);
}

emergencyWithdrawal();

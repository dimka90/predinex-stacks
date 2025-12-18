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

async function claimWinnings() {
    const network = STACKS_MAINNET;
    console.log(`💰 Claiming winnings from settled pools...`);
    console.log(`📋 Contract: ${CONTRACT_NAME}`);
    console.log(`💼 Wallet: ${CONTRACT_ADDRESS}\n`);

    let claimSuccess = 0;
    let failCount = 0;

    // Claim from settled pools: 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22
    const settledPools = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];

    for (const poolId of settledPools) {
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
            console.log(`🎁 Claiming from pool ${poolId}...`);
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
    console.log(`✅ Successful claims: ${claimSuccess}`);
    console.log(`❌ Failed claims: ${failCount}`);
    console.log(`💵 Total claim transactions: ${claimSuccess}`);
}

claimWinnings();

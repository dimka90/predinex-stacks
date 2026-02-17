import { makeContractCall, broadcastTransaction, AnchorMode, uintCV, stringAsciiCV } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const CONTRACT_ADDRESS = process.env.WALLET_ADDRESS || 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';
const CONTRACT_NAME = 'predinex-pool-1765641059991';

if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY environment variable is required.");
    process.exit(1);
}

async function runAutoActivity() {
    console.log('\n🤖 Auto Activity Generator - 10 Transactions');
    console.log(`📍 Network: Mainnet`);
    console.log(`📦 Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}\n`);

    let successCount = 0;
    let failCount = 0;

    // Transaction 1-5: Create pools
    for (let i = 0; i < 5; i++) {
        console.log(`\n[${i + 1}/10] Creating pool ${i + 1}...`);
        try {
            const txOptions = {
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'create-pool',
                functionArgs: [
                    stringAsciiCV(`Pool ${i + 1}`),
                    stringAsciiCV(`Auto-generated pool for activity`),
                    stringAsciiCV('Yes'),
                    stringAsciiCV('No'),
                    uintCV(1000)
                ],
                senderKey: PRIVATE_KEY,
                network: STACKS_MAINNET,
                anchorMode: AnchorMode.Any,
                fee: 50000, // Cheap fee
            };

            const transaction = await makeContractCall(txOptions);
            const response = await broadcastTransaction({ transaction, network: STACKS_MAINNET });

            if ('error' in response) {
                console.log(`   ❌ Failed: ${response.error}`);
                failCount++;
            } else {
                console.log(`   ✅ Success! TX: ${response.txid.slice(0, 16)}...`);
                successCount++;
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            failCount++;
        }

        // Small delay between transactions
        await new Promise(r => setTimeout(r, 1000));
    }

    // Transaction 6-10: Place bets
    for (let i = 0; i < 5; i++) {
        console.log(`\n[${i + 6}/10] Placing bet ${i + 1}...`);
        try {
            const txOptions = {
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'place-bet',
                functionArgs: [
                    uintCV(i), // pool-id
                    uintCV(i % 2), // outcome (0 or 1)
                    uintCV(500000) // amount (0.5 STX)
                ],
                senderKey: PRIVATE_KEY,
                network: STACKS_MAINNET,
                anchorMode: AnchorMode.Any,
                fee: 50000, // Cheap fee
            };

            const transaction = await makeContractCall(txOptions);
            const response = await broadcastTransaction({ transaction, network: STACKS_MAINNET });

            if ('error' in response) {
                console.log(`   ❌ Failed: ${response.error}`);
                failCount++;
            } else {
                console.log(`   ✅ Success! TX: ${response.txid.slice(0, 16)}...`);
                successCount++;
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            failCount++;
        }

        // Small delay between transactions
        await new Promise(r => setTimeout(r, 1000));
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Activity Summary');
    console.log('='.repeat(50));
    console.log(`✅ Successful: ${successCount}/10`);
    console.log(`❌ Failed: ${failCount}/10`);
    console.log(`\n🎯 Total transactions: ${successCount + failCount}`);
    console.log(`💰 Estimated fees: ${(successCount + failCount) * 50000 / 1000000} STX`);
    console.log('\n✅ Activity generation complete!');
    console.log('📈 Check leaderboard at: https://stacks.org/builder-challenge\n');
}

runAutoActivity().catch(console.error);

import { makeContractDeploy, broadcastTransaction, AnchorMode, ClarityVersion } from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { readFileSync } from 'fs';
import path from 'path';

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet';
const WALLET_ADDRESS = process.env.WALLET_ADDRESS || 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';

if (!PRIVATE_KEY) {
    console.error("❌ Error: PRIVATE_KEY or DEPLOYER_KEY environment variable is required.");
    console.error("Set your private key in .env file");
    process.exit(1);
}

async function deployContract() {
    console.log(`🚀 Deploying Predinex to ${NETWORK_ENV}...`);
    console.log(`📦 Reliable deployment script (auto-nonce)\n`);

    const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
    const networkName = NETWORK_ENV === 'mainnet' ? 'Mainnet' : 'Testnet';

    try {
        // Step 1: Check contract file
        const contractPath = path.join(process.cwd(), 'contracts', 'predinex-pool.clar');
        console.log(`📄 Reading contract from: ${contractPath}`);
        const contractSource = readFileSync(contractPath, 'utf-8');

        const contractSizeKB = (contractSource.length / 1024).toFixed(2);
        console.log(`📊 Contract size: ${contractSizeKB} KB`);

        if (contractSource.length > 100000) {
            console.warn(`⚠️  WARNING: Contract is large (${contractSizeKB} KB). May cause deployment issues.`);
        }

        // Step 2: Generate unique contract name
        const timestamp = Date.now();
        const contractName = `predinex-pool-${timestamp}`;
        console.log(`📝 Contract name: ${contractName}`);

        // Step 3: Set high fee for reliable deployment
        const fee = 1000000; // 1 STX - high fee for priority processing
        console.log(`💰 Fee: ${(fee / 1_000_000).toFixed(2)} STX`);
        console.log(`📍 Network: ${networkName}`);
        console.log(`👛 Deployer: ${WALLET_ADDRESS}\n`);

        // Step 4: Create transaction (nonce auto-managed)
        const txOptions = {
            contractName,
            codeBody: contractSource,
            senderKey: PRIVATE_KEY,
            network,
            // No nonce specified - library fetches automatically
            anchorMode: AnchorMode.Any,
            clarityVersion: ClarityVersion.Clarity3,
            fee: fee,
            postConditionMode: 0x01, // Allow
        };

        console.log("⏳ Creating deployment transaction...");
        const transaction = await makeContractDeploy(txOptions);

        console.log("📤 Broadcasting to blockchain...");
        const broadcastResponse = await broadcastTransaction({ transaction, network });

        // Step 5: Handle response
        if ('error' in broadcastResponse) {
            console.error('\n❌ ❌ ❌ DEPLOYMENT FAILED ❌ ❌ ❌\n');
            console.error('═'.repeat(70));
            console.error(`Error: ${broadcastResponse.error}`);

            if (broadcastResponse.reason) {
                console.error(`Reason: ${broadcastResponse.reason}`);
            }

            if (broadcastResponse.reason_data) {
                console.error(`Details:`, JSON.stringify(broadcastResponse.reason_data, null, 2));
            }
            console.error('═'.repeat(70));

            console.log('\n🔍 Why This Failed:');

            if (broadcastResponse.error.includes('ConflictingNonceInMempool')) {
                console.log('   ⚠️  You have a transaction pending with the same nonce');
                console.log('   ✅ SOLUTION: Wait 15-30 minutes for pending transaction to confirm');
                console.log('   ✅ OR: Check pending transactions and wait for them to clear');
            } else if (broadcastResponse.error.includes('TooMuchChaining')) {
                console.log('   ⚠️  Too many pending transactions in mempool');
                console.log('   ✅ SOLUTION: Wait 30 minutes for transactions to confirm');
            } else if (broadcastResponse.error.includes('NotEnoughFunds')) {
                console.log('   ⚠️  Insufficient STX balance');
                console.log(`   ✅ SOLUTION: Add more STX to ${WALLET_ADDRESS}`);
            } else if (broadcastResponse.error.includes('contract already exists')) {
                console.log('   ⚠️  A contract with this name already exists');
                console.log('   ✅ SOLUTION: This is actually fine - just a timing issue');
                console.log('   ✅ Run the script again to generate a new contract name');
            } else {
                console.log('   ⚠️  Unknown error - check details above');
            }

            console.log(`\n🔗 Check your wallet: https://explorer.hiro.so/address/${WALLET_ADDRESS}?chain=${NETWORK_ENV}\n`);

            process.exit(1);
        } else {
            console.log('\n✅ ✅ ✅ DEPLOYMENT TRANSACTION SENT! ✅ ✅ ✅\n');
            console.log('═'.repeat(70));
            console.log(`📋 Transaction ID:`);
            console.log(`    ${broadcastResponse.txid}`);
            console.log(`\n🔗 Track on Explorer:`);
            console.log(`    https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=${NETWORK_ENV}`);
            console.log(`\n📝 Contract Details:`);
            console.log(`    Name: ${contractName}`);
            console.log(`    Address: ${WALLET_ADDRESS}.${contractName}`);
            console.log(`\n💰 Fee Paid: ${(fee / 1_000_000).toFixed(2)} STX`);
            console.log('═'.repeat(70));

            console.log(`\n⏰ IMPORTANT - Transaction Status:`);
            console.log(`   🟡 Status: PENDING (waiting for blockchain confirmation)`);
            console.log(`   ⏱️  Expected time: 10-15 minutes`);
            console.log(`\n📋 What to do now:`);
            console.log(`   1. ⏰ WAIT 15 minutes - refresh the explorer link above`);
            console.log(`   2. 🔍 Check if status changes from "pending" to "success"`);
            console.log(`   3. ✅ If status = "success" → Deployment complete! 🎉`);
            console.log(`   4. ❌ If status = "abort_by_response" → Deployment failed`);
            console.log(`\n🚨 COMMON ISSUE - "abort_by_response":`);
            console.log(`   This means your previous transactions are still pending!`);
            console.log(`   Solution: Wait 30 minutes for ALL pending transactions to clear,`);
            console.log(`   then run this script again.`);
            console.log(`\n⏰ Transaction sent at: ${new Date().toISOString()}\n`);
        }
    } catch (error: any) {
        console.error('\n❌ CRITICAL ERROR\n');
        console.error('═'.repeat(70));
        console.error(`Message: ${error.message}`);

        if (error.message.includes('fetch') || error.message.includes('network')) {
            console.log('\n🌐 Network Error Detected');
            console.log('   ⚠️  Cannot reach Stacks API');
            console.log('   ✅ SOLUTIONS:');
            console.log('      1. Check your internet connection');
            console.log('      2. Try again in 1 minute (API rate limit)');
            console.log('      3. Use VPN if API is blocked in your region');
        } else if (error.message.includes('private key')) {
            console.log('\n🔑 Private Key Error');
            console.log('   ⚠️  Invalid private key format');
            console.log('   ✅ Check your .env file - PRIVATE_KEY should be 64 hex characters');
        }

        console.error('\n📚 Stack Trace:');
        console.error(error.stack);
        console.error('═'.repeat(70));

        process.exit(1);
    }
}

deployContract();

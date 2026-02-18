import { makeContractDeploy, broadcastTransaction, AnchorMode, ClarityVersion } from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { readFileSync } from 'fs';
import path from 'path';

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet';
const WALLET_ADDRESS = process.env.WALLET_ADDRESS || 'SPENV2J0V4BHRFAZ6FVF97K9ZGQJ0GT19RC3JFN7';

if (!PRIVATE_KEY) {
    console.error("❌ Error: PRIVATE_KEY or DEPLOYER_KEY environment variable is required.");
    console.error("Set your private key in .env file");
    process.exit(1);
}

// Helper function to fetch nonce
async function fetchNonce(address: string, isMainnet: boolean): Promise<number> {
    const apiUrl = isMainnet
        ? 'https://api.hiro.so/v2/accounts'
        : 'https://api.testnet.hiro.so/v2/accounts';

    const response = await fetch(`${apiUrl}/${address}?proof=0`);
    const data: any = await response.json();
    return data.nonce || 0;
}

async function deployContract() {
    console.log(`🚀 Deploying Predinex to ${NETWORK_ENV}...`);
    console.log(`📦 Using enhanced deployment with proper error handling\n`);

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
            console.warn(`⚠️  WARNING: Contract is large (${contractSizeKB} KB). This may cause deployment issues.`);
        }

        // Step 2: Generate unique contract name
        const timestamp = Date.now();
        const contractName = `predinex-pool-${timestamp}`;
        console.log(`📝 Contract name: ${contractName}`);

        // Step 3: Fetch current nonce
        console.log(`🔍 Fetching current nonce for ${WALLET_ADDRESS}...`);
        const currentNonce = await fetchNonce(WALLET_ADDRESS, NETWORK_ENV === 'mainnet');
        console.log(`✅ Current nonce: ${currentNonce}`);

        // Step 4: Calculate appropriate fee (increased from 150k to 1M µSTX)
        const fee = 1000000; // 1 STX for very reliable deployment
        console.log(`💰 Using fee: ${fee} µSTX (${(fee / 1_000_000).toFixed(2)} STX)`);

        // Step 5: Create transaction
        const txOptions = {
            contractName,
            codeBody: contractSource,
            senderKey: PRIVATE_KEY,
            network,
            nonce: currentNonce, // Explicitly set nonce
            anchorMode: AnchorMode.Any,
            clarityVersion: ClarityVersion.Clarity3,
            fee: fee,
            postConditionMode: 0x01, // Allow
        };

        console.log("\n⏳ Creating deployment transaction...");
        const transaction = await makeContractDeploy(txOptions);

        console.log("📤 Broadcasting to network...");
        console.log(`📍 Network: ${networkName}\n`);

        const broadcastResponse = await broadcastTransaction({ transaction, network });

        // Step 6: Handle response
        if ('error' in broadcastResponse) {
            console.error('\n❌ ❌ ❌ DEPLOYMENT FAILED ❌ ❌ ❌\n');
            console.error('Error:', broadcastResponse.error);

            if (broadcastResponse.reason) {
                console.error('Reason:', broadcastResponse.reason);
            }

            if (broadcastResponse.reason_data) {
                console.error('Details:', broadcastResponse.reason_data);
            }

            console.log('\n💡 Troubleshooting:');
            console.log('   1. Check if contract syntax is valid: clarinet check');
            console.log('   2. Verify contract size is under 100KB');
            console.log('   3. Ensure contract name is unique');
            console.log('   4. Check if you have enough STX balance (need >1 STX)');
            console.log(`   5. Check explorer: https://explorer.hiro.so/address/${WALLET_ADDRESS}?chain=${NETWORK_ENV}\n`);

            process.exit(1);
        } else {
            console.log('\n✅ ✅ ✅ CONTRACT DEPLOYED SUCCESSFULLY! ✅ ✅ ✅\n');
            console.log('═'.repeat(70));
            console.log(`📋 Transaction ID: ${broadcastResponse.txid}`);
            console.log(`🔗 Explorer: https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=${NETWORK_ENV}`);
            console.log(`📝 Contract Name: ${contractName}`);
            console.log(`📍 Contract Address: ${WALLET_ADDRESS}.${contractName}`);
            console.log('═'.repeat(70));

            console.log(`\n💡 Next steps:`);
            console.log(`   1. ⏰ Wait 10-15 minutes for confirmation`);
            console.log(`   2. 🔍 Check transaction status:`);
            console.log(`      https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=${NETWORK_ENV}`);
            console.log(`   3. ✅ Once confirmed, update your .env file:`);
            console.log(`      LATEST_TX_ID=${broadcastResponse.txid}`);
            console.log(`      LATEST_CONTRACT_NAME=${contractName}`);
            console.log(`      CONTRACT_ADDRESS=${WALLET_ADDRESS}`);
            console.log(`   4. 🎉 Your contract will be live at: ${WALLET_ADDRESS}.${contractName}`);
            console.log(`\n⏰ Deployment initiated at: ${new Date().toISOString()}`);
            console.log(`💰 Fee paid: ${(fee / 1_000_000).toFixed(2)} STX\n`);
        }
    } catch (error: any) {
        console.error('\n❌ Unexpected error during deployment:', error.message);

        if (error.stack) {
            console.error('\nStack trace:', error.stack);
        }

        console.log('\n💡 Common issues:');
        console.log('   - Network connectivity problem');
        console.log('   - Invalid private key');
        console.log('   - Insufficient STX balance (need >1 STX)');
        console.log('   - Contract syntax errors');
        console.log('   - Nonce issues (wait a few minutes and try again)');

        process.exit(1);
    }
}

deployContract();

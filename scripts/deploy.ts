import { makeContractDeploy, broadcastTransaction, AnchorMode, ClarityVersion } from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { readFileSync } from 'fs';
import path from 'path';

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet'; // Default to mainnet for Builder Challenge

if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY or DEPLOYER_KEY environment variable is required.");
    console.error("Set your private key in .env file");
    process.exit(1);
}

async function deployContract() {
    console.log(`🚀 Deploying Predinex to ${NETWORK_ENV}...`);
    console.log(`📦 Using Clarity 4 with enhanced features for Builder Challenge\n`);

    const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
    const networkName = NETWORK_ENV === 'mainnet' ? 'Mainnet' : 'Testnet';

    // Read contract source code
    const contractPath = path.join(process.cwd(), 'contracts', 'predinex-pool.clar');
    const contractSource = readFileSync(contractPath, 'utf-8');

    // Use versioned contract name for multiple deployments
    const timestamp = Date.now();
    const contractName = `predinex-pool-${timestamp}`;

    console.log(`📄 Contract: ${contractName}`);
    console.log(`📍 Network: ${networkName}`);
    console.log(`📖 Reading from: ${contractPath}\n`);

    const txOptions = {
        contractName,
        codeBody: contractSource,
        senderKey: PRIVATE_KEY,
        network,
        anchorMode: AnchorMode.Any,
        clarityVersion: ClarityVersion.Clarity3, // Clarity 3 supports Clarity 4 functions
        fee: 150000, // Increased fee for mainnet
        postConditionMode: 0x01, // Allow
    };

    try {
        console.log("⏳ Creating transaction...");
        const transaction = await makeContractDeploy(txOptions);
        
        console.log("📤 Broadcasting to network...");
        const broadcastResponse = await broadcastTransaction({ transaction, network });

        if ('error' in broadcastResponse) {
            console.error('❌ Deployment failed:', broadcastResponse.error);
            process.exit(1);
        } else {
            console.log('\n✅ Contract deployed successfully!');
            console.log(`📋 Transaction ID: ${broadcastResponse.txid}`);
            console.log(`🔗 Explorer: https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=${NETWORK_ENV}`);
            console.log(`\n📝 Contract Name: ${contractName}`);
            console.log(`\n💡 Next steps:`);
            console.log(`   1. Wait for transaction confirmation (~10 minutes)`);
            console.log(`   2. Share your contract address on GitHub`);
            console.log(`   3. Generate activity by calling contract functions`);
            console.log(`   4. Check leaderboard at https://stacks.org/builder-challenge`);
        }
    } catch (error) {
        console.error('❌ Error deploying contract:', error);
        process.exit(1);
    }
}

deployContract();

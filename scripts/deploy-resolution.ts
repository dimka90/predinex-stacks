import { makeContractDeploy, broadcastTransaction, AnchorMode, ClarityVersion } from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { readFileSync } from 'fs';
import path from 'path';

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet';

if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY or DEPLOYER_KEY environment variable is required.");
    console.error("Set your private key in .env file");
    process.exit(1);
}

async function deployResolutionEngine() {
    console.log(`🚀 Deploying predinex-resolution-engine to ${NETWORK_ENV}...`);
    console.log(`📦 Using Clarity 3 with enhanced features\n`);

    const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
    const networkName = NETWORK_ENV === 'mainnet' ? 'Mainnet' : 'Testnet';

    // Read contract source code
    const contractPath = path.join(process.cwd(), 'contracts', 'predinex-resolution-engine.clar');
    const contractSource = readFileSync(contractPath, 'utf-8');

    // Use versioned contract name
    const timestamp = Date.now();
    const contractName = `predinex-resolution-engine-${timestamp}`;

    console.log(`📄 Contract: ${contractName}`);
    console.log(`📍 Network: ${networkName}`);
    console.log(`📖 Reading from: ${contractPath}\n`);

    const txOptions = {
        contractName,
        codeBody: contractSource,
        senderKey: PRIVATE_KEY as string,
        network,
        anchorMode: AnchorMode.Any,
        clarityVersion: ClarityVersion.Clarity3,
        fee: 150000,
        postConditionMode: 0x01,
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
            console.log(`📝 Contract Name: ${contractName}`);
            console.log(`\n💡 Next Steps:`);
            console.log(`   1. Wait for transaction confirmation (~10 minutes)`);
            console.log(`   2. Update README.md with contract address`);
            console.log(`   3. Test contract interactions`);
        }
    } catch (error) {
        console.error('❌ Error deploying contract:', error);
        process.exit(1);
    }
}

deployResolutionEngine();

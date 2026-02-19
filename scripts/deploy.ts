import { makeContractDeploy, broadcastTransaction, AnchorMode, ClarityVersion } from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { readFileSync } from 'fs';
import path from 'path';

// Load environment variables

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet'; // Default to mainnet for Builder Challenge

if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY or DEPLOYER_KEY environment variable is required.");
    console.error("Set your private key in .env file");
    process.exit(1);
}

async function deployContract(contractFileName: string, contractNamePrefix: string) {
    const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
    const networkName = NETWORK_ENV === 'mainnet' ? 'Mainnet' : 'Testnet';

    // Read contract source code
    const contractPath = path.join(process.cwd(), 'contracts', contractFileName);
    const contractSource = readFileSync(contractPath, 'utf-8');

    // Use versioned contract name for multiple deployments
    const timestamp = Date.now();
    const contractName = `${contractNamePrefix}-${timestamp}`;

    console.log(`\n📄 Contract: ${contractName}`);
    console.log(`📍 Network: ${networkName}`);
    console.log(`📖 Reading from: ${contractPath}\n`);

    const txOptions = {
        contractName,
        codeBody: contractSource,
        senderKey: PRIVATE_KEY as string, // Type assertion - already validated above
        network,
        anchorMode: AnchorMode.Any,
        clarityVersion: ClarityVersion.Clarity3, // Clarity 3 supports Clarity 4 functions
        fee: 25000, // Reduced fee for low balance account (0.025 STX)
        postConditionMode: 0x01, // Allow
    };

    try {
        console.log("⏳ Creating transaction...");
        const transaction = await makeContractDeploy(txOptions);

        console.log("📤 Broadcasting to network...");
        const broadcastResponse = await broadcastTransaction({ transaction, network });

        if ('error' in broadcastResponse) {
            console.error('❌ Deployment failed:', broadcastResponse.error);
            throw new Error(broadcastResponse.error);
        } else {
            console.log('\n✅ Contract deployed successfully!');
            console.log(`📋 Transaction ID: ${broadcastResponse.txid}`);
            console.log(`🔗 Explorer: https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=${NETWORK_ENV}`);
            console.log(`📝 Contract Name: ${contractName}`);
            return { contractName, txid: broadcastResponse.txid };
        }
    } catch (error) {
        console.error(`❌ Error deploying ${contractName}:`, error);
        throw error;
    }
}

async function deployAll() {
    console.log(`🚀 Deploying Predinex Contracts to ${NETWORK_ENV}...`);
    console.log(`📦 Using Clarity 3 with enhanced features\n`);
    console.log(`ℹ️  Contracts 1-2 already deployed:`);
    console.log(`   ✅ predinex-oracle-registry-1769574272753`);
    console.log(`   ✅ liquidity-incentives-1769574671620\n`);
    console.log(`📋 Deploying remaining contracts (3-4)...\n`);

    const deployedContracts = [];

    try {
        // Contract 3: predinex-pool
        console.log("═══════════════════════════════════════");
        console.log("📦 [3/4] Deploying predinex-pool...");
        console.log("═══════════════════════════════════════");
        const poolResult = await deployContract('predinex-pool.clar', 'predinex-pool');
        deployedContracts.push(poolResult);

        // Wait a bit between deployments
        console.log("\n⏳ Waiting 5 seconds before next deployment...\n");
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Contract 4: predinex-resolution-engine
        console.log("═══════════════════════════════════════");
        console.log("📦 [4/4] Deploying predinex-resolution-engine...");
        console.log("═══════════════════════════════════════");
        const resolutionResult = await deployContract('predinex-resolution-engine.clar', 'predinex-resolution-engine');
        deployedContracts.push(resolutionResult);

        // Summary
        console.log("\n\n╔═══════════════════════════════════════════════════════════╗");
        console.log("║          🎉 ALL CONTRACTS DEPLOYED SUCCESSFULLY!          ║");
        console.log("╚═══════════════════════════════════════════════════════════╝\n");

        console.log("📋 Deployment Summary:");
        console.log("─────────────────────────────────────────────────────────────");
        deployedContracts.forEach((contract, index) => {
            console.log(`${index + 3}. ${contract.contractName}`);
            console.log(`   TX: ${contract.txid}\n`);
        });

        console.log("\n💡 Next Steps:");
        console.log("   1. Wait for transaction confirmations (~10 minutes)");
        console.log("   2. Update README.md with new contract addresses");
        console.log("   3. Test contract interactions");
        console.log("   4. Share on GitHub for Builder Challenge");

    } catch (error) {
        console.error('\n❌ Deployment process failed:', error);
        process.exit(1);
    }
}

deployAll();

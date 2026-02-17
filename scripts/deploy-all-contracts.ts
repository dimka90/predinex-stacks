import { makeContractDeploy, broadcastTransaction, AnchorMode, ClarityVersion } from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { readFileSync } from 'fs';
import path from 'path';

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet';
const WALLET_ADDRESS = process.env.WALLET_ADDRESS || 'SPENV2J0V4BHRFAZ6FVF97K9ZGQJ0GT19RC3JFN7';

if (!PRIVATE_KEY) {
    console.error("❌ Error: PRIVATE_KEY or DEPLOYER_KEY required");
    process.exit(1);
}

const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

// Helper to deploy a single contract
async function deploySingleContract(contractFileName: string, waitMinutes: number = 15): Promise<string> {
    const contractPath = path.join(process.cwd(), 'contracts', contractFileName);
    const contractSource = readFileSync(contractPath, 'utf-8');
    const contractSizeKB = (contractSource.length / 1024).toFixed(2);

    const timestamp = Date.now();
    const baseNameWithoutExt = contractFileName.replace('.clar', '');
    const contractName = `${baseNameWithoutExt}-${timestamp}`;

    console.log(`\n${'='.repeat(70)}`);
    console.log(`📦 Deploying: ${contractFileName}`);
    console.log(`📝 Contract name: ${contractName}`);
    console.log(`📊 Size: ${contractSizeKB} KB`);
    console.log(`💰 Fee: 1.00 STX`);
    console.log(`${'='.repeat(70)}`);

    const txOptions = {
        contractName,
        codeBody: contractSource,
        senderKey: PRIVATE_KEY,
        network,
        anchorMode: AnchorMode.Any,
        clarityVersion: ClarityVersion.Clarity3,
        fee: 1000000, // 1 STX
        postConditionMode: 0x01,
    };

    try {
        console.log("⏳ Creating transaction...");
        const transaction = await makeContractDeploy(txOptions);

        console.log("📤 Broadcasting...");
        const response = await broadcastTransaction({ transaction, network });

        if ('error' in response) {
            console.error(`\n❌ FAILED: ${response.error}`);
            if (response.reason) console.error(`Reason: ${response.reason}`);
            throw new Error(`Deployment failed: ${response.error}`);
        }

        console.log(`\n✅ Transaction sent!`);
        console.log(`📋 TX ID: ${response.txid}`);
        console.log(`🔗 https://explorer.hiro.so/txid/${response.txid}?chain=${NETWORK_ENV}`);
        console.log(`📍 Address: ${WALLET_ADDRESS}.${contractName}`);
        console.log(`\n⏰ Waiting ${waitMinutes} minutes for confirmation...`);
        console.log(`   (Transaction must be mined before deploying next contract)`);

        // Wait for confirmation
        const waitMs = waitMinutes * 60 * 1000;
        await new Promise(resolve => setTimeout(resolve, waitMs));

        return contractName;

    } catch (error: any) {
        console.error(`\n❌ Error deploying ${contractFileName}:`, error.message);
        throw error;
    }
}

async function deployAllContracts() {
    console.log(`\n🚀 PREDINEX MULTI-CONTRACT DEPLOYMENT`);
    console.log(`📍 Network: ${NETWORK_ENV}`);
    console.log(`👛 Deployer: ${WALLET_ADDRESS}`);
    console.log(`\n⚠️  IMPORTANT: Contracts will be deployed in dependency order:`);
    console.log(`   1. predinex-oracle-registry (no dependencies)`);
    console.log(`   2. liquidity-incentives (no dependencies)`);
    console.log(`   3. predinex-pool (depends on 1 & 2)`);
    console.log(`   4. predinex-resolution-engine (depends on 1)`);
    console.log(`\n⏱️  Total estimated time: ~60 minutes (15 min per contract)\n`);

    const deployedContracts: Record<string, string> = {};

    try {
        // Deploy Step 1: Oracle Registry
        console.log("\n" + "█".repeat(70));
        console.log("STEP 1/4: ORACLE REGISTRY");
        console.log("█".repeat(70));
        deployedContracts['oracle-registry'] = await deploySingleContract('predinex-oracle-registry.clar', 15);

        // Deploy Step 2: Liquidity Incentives  
        console.log("\n" + "█".repeat(70));
        console.log("STEP 2/4: LIQUIDITY INCENTIVES");
        console.log("█".repeat(70));
        deployedContracts['liquidity-incentives'] = await deploySingleContract('liquidity-incentives.clar', 15);

        // Deploy Step 3: Pool (depends on 1 & 2)
        console.log("\n" + "█".repeat(70));
        console.log("STEP 3/4: PREDINEX POOL (Main Contract)");
        console.log("█".repeat(70));
        console.log("⚠️  This contract references:");
        console.log(`   .${deployedContracts['oracle-registry']}`);
        console.log(`   .${deployedContracts['liquidity-incentives']}\n`);
        deployedContracts['pool'] = await deploySingleContract('predinex-pool.clar', 15);

        // Deploy Step 4: Resolution Engine
        console.log("\n" + "█".repeat(70));
        console.log("STEP 4/4: RESOLUTION ENGINE");
        console.log("█".repeat(70));
        deployedContracts['resolution-engine'] = await deploySingleContract('predinex-resolution-engine.clar', 15);

        // Success summary
        console.log("\n" + "✅".repeat(35));
        console.log("🎉 ALL CONTRACTS DEPLOYED SUCCESSFULLY! 🎉");
        console.log("✅".repeat(35));
        console.log(`\n📋 Deployed Contracts:`);
        console.log(`\n1. Oracle Registry:`);
        console.log(`   ${WALLET_ADDRESS}.${deployedContracts['oracle-registry']}`);
        console.log(`\n2. Liquidity Incentives:`);
        console.log(`   ${WALLET_ADDRESS}.${deployedContracts['liquidity-incentives']}`);
        console.log(`\n3. Predinex Pool (Main):`);
        console.log(`   ${WALLET_ADDRESS}.${deployedContracts['pool']}`);
        console.log(`\n4. Resolution Engine:`);
        console.log(`   ${WALLET_ADDRESS}.${deployedContracts['resolution-engine']}`);

        console.log(`\n💡 Next Steps:`);
        console.log(`   1. Update your .env file with the new contract names`);
        console.log(`   2. Test the contracts using the interaction scripts`);
        console.log(`   3. Update your frontend to use the new contract addresses`);
        console.log(`\n⏰ Deployment completed at: ${new Date().toISOString()}\n`);

    } catch (error: any) {
        console.error("\n❌ DEPLOYMENT SEQUENCE FAILED");
        console.error(`Error: ${error.message}`);
        console.log(`\n✅ Successfully deployed:`);
        for (const [name, contractName] of Object.entries(deployedContracts)) {
            console.log(`   ${name}: ${contractName}`);
        }
        console.log(`\n💡 You can resume deployment by deploying the remaining contracts manually`);
        process.exit(1);
    }
}

deployAllContracts();

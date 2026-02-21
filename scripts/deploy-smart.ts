import { makeContractDeploy, broadcastTransaction, AnchorMode, ClarityVersion } from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

/**
 * deploy-smart.ts
 * Manages the deployment of Predinex smart contracts in dependency order.
 * Automatically updates contract source code to reference newly deployed names.
 */

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet';
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;

if (!PRIVATE_KEY || !WALLET_ADDRESS) {
    console.error("❌ Error: PRIVATE_KEY and WALLET_ADDRESS are required in environment or .env");
    process.exit(1);
}

const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
const WAIT_TIME_MINUTES = 15;

async function deployContract(
    fileName: string,
    replacements: Record<string, string> = {}
): Promise<string> {
    const contractPath = path.join(process.cwd(), 'contracts', fileName);
    let source = readFileSync(contractPath, 'utf-8');

    // Apply replacements for dependencies
    for (const [oldName, newName] of Object.entries(replacements)) {
        console.log(`🔄 Replacing dependency: ${oldName} -> ${newName}`);
        // Match .contract-name with optional suffix
        const regex = new RegExp(`\\.${oldName}(-[0-9]+)?`, 'g');
        source = source.replace(regex, `.${newName}`);
    }

    const timestamp = Date.now();
    const baseName = fileName.replace('.clar', '');
    const contractName = `${baseName}-${timestamp}`;

    console.log(`\n📦 Deploying: ${fileName} as ${contractName}`);
    console.log(`💰 Fee: 1.00 STX`);

    const txOptions = {
        contractName,
        codeBody: source,
        senderKey: PRIVATE_KEY!,
        network,
        anchorMode: AnchorMode.Any,
        clarityVersion: ClarityVersion.Clarity2,
        fee: 1000000, // 1 STX
    };

    try {
        const transaction = await makeContractDeploy(txOptions);
        const response = await broadcastTransaction({ transaction, network });

        if ('error' in response) {
            throw new Error(`Deployment failed: ${response.error} ${response.reason || ''}`);
        }

        console.log(`✅ Transaction sent! TX ID: ${response.txid}`);
        console.log(`🔗 https://explorer.hiro.so/txid/${response.txid}?chain=${NETWORK_ENV}`);

        console.log(`\n⏳ Waiting ${WAIT_TIME_MINUTES} minutes for confirmation...`);
        await new Promise(resolve => setTimeout(resolve, WAIT_TIME_MINUTES * 60 * 1000));

        return contractName;
    } catch (error: any) {
        console.error(`❌ Error deploying ${fileName}:`, error.message);
        throw error;
    }
}

async function runDeployment() {
    console.log(`🚀 Starting Predinex Smart Deployment on ${NETWORK_ENV}`);
    const deployed: Record<string, string> = {};

    try {
        // 1. Oracle Registry
        deployed['predinex-oracle-registry'] = await deployContract('predinex-oracle-registry.clar');

        // 2. Liquidity Incentives
        deployed['liquidity-incentives'] = await deployContract('liquidity-incentives.clar');

        // 3. Predinex Pool
        // Depends on Oracle Registry and Liquidity Incentives
        deployed['predinex-pool'] = await deployContract('predinex-pool.clar', {
            'predinex-oracle-registry': deployed['predinex-oracle-registry'],
            'liquidity-incentives': deployed['liquidity-incentives']
        });

        // 4. Resolution Engine
        // Depends on Oracle Registry and Predinex Pool
        deployed['predinex-resolution-engine'] = await deployContract('predinex-resolution-engine.clar', {
            'predinex-oracle-registry': deployed['predinex-oracle-registry'],
            'predinex-pool': deployed['predinex-pool']
        });

        console.log('\n✨ ALL CONTRACTS DEPLOYED SUCCESSFULLY');
        console.log(JSON.stringify(deployed, null, 2));

        writeFileSync('DEPLOYED_CONTRACTS.json', JSON.stringify(deployed, null, 2));
        console.log('\n📝 Deployed names saved to DEPLOYED_CONTRACTS.json');

    } catch (error) {
        console.error('\n💥 Deployment sequence halted due to error');
        if (Object.keys(deployed).length > 0) {
            console.log('Partial success. Deployed so far:', deployed);
            writeFileSync('DEPLOYED_CONTRACTS_PARTIAL.json', JSON.stringify(deployed, null, 2));
        }
        process.exit(1);
    }
}

runDeployment();

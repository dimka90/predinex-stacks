import { makeContractDeploy, broadcastTransaction, AnchorMode, ClarityVersion } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import { readFileSync } from 'fs';
import path from 'path';

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const WALLET_ADDRESS = 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';
const NETWORK = STACKS_MAINNET;

if (!PRIVATE_KEY) {
    console.error("❌ Error: PRIVATE_KEY required in environment");
    process.exit(1);
}

// Helper to fetch current nonce
async function fetchNonce(address: string): Promise<number> {
    const response = await fetch(`https://api.hiro.so/v2/accounts/${address}?proof=0`);
    const data: any = await response.json();
    return data.nonce || 0;
}

// Helper to deploy a contract
async function deployContract(contractFileName: string, contractName: string, nonce: number) {
    const contractPath = path.join(process.cwd(), 'contracts', contractFileName);
    const codeBody = readFileSync(contractPath, 'utf-8');

    console.log(`\n📦 Deploying: ${contractFileName} as ${contractName}`);
    console.log(`🔢 Nonce: ${nonce}`);
    console.log(`💰 Fee: 1 STX`);

    const txOptions = {
        contractName,
        codeBody,
        senderKey: PRIVATE_KEY!,
        network: NETWORK,
        nonce,
        anchorMode: AnchorMode.Any,
        clarityVersion: ClarityVersion.Clarity3,
        fee: 1000000, // 1 STX
        postConditionMode: 0x01,
    };

    const transaction = await makeContractDeploy(txOptions);
    const response = await broadcastTransaction({ transaction, network: NETWORK });

    if ('error' in response) {
        console.error(`❌ FAILED: ${response.error}`);
        throw new Error(`Deployment failed: ${response.error}`);
    }

    console.log(`✅ Success! TX ID: ${response.txid}`);
    console.log(`🔗 https://explorer.hiro.so/txid/${response.txid}?chain=mainnet`);
    return response.txid;
}

async function main() {
    console.log("🚀 STARTING PREDINEX REDEPLOYMENT");
    const timestamp = Date.now();

    let nonce = await fetchNonce(WALLET_ADDRESS);
    console.log(`🏁 Initial Nonce: ${nonce}`);

    const contracts = [
        { file: 'predinex-oracle-registry.clar', name: `predinex-oracle-registry-${timestamp}` },
        { file: 'liquidity-incentives.clar', name: `liquidity-incentives-${timestamp}` },
        { file: 'predinex-pool.clar', name: `predinex-pool-${timestamp}` },
        { file: 'predinex-resolution-engine.clar', name: `predinex-resolution-engine-${timestamp}` }
    ];

    for (const contract of contracts) {
        await deployContract(contract.file, contract.name, nonce);
        nonce++;
        console.log("⏳ Waiting 30 seconds before next broadcast...");
        await new Promise(resolve => setTimeout(resolve, 30000));
    }

    console.log("\n✨ ALL CONTRACTS BROADCASTED SUCCESSFULLY!");
    console.log("⚠️  Please wait for confirmation on the explorer before updating config.");
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});

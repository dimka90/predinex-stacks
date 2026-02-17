import { makeContractDeploy, broadcastTransaction, AnchorMode, ClarityVersion } from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { readFileSync } from 'fs';
import path from 'path';

const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet';
const WALLET_ADDRESS = process.env.WALLET_ADDRESS || 'SPENV2J0V4BHRFAZ6FVF97K9ZGQJ0GT19RC3JFN7';

// Get contract name from command line args
const contractFileName = process.argv[2];

if (!contractFileName) {
    console.error("❌ Usage: npx tsx deploy-single.ts <contract-file-name>");
    console.error("Example: npx tsx deploy-single.ts predinex-oracle-registry");
    process.exit(1);
}

if (!PRIVATE_KEY) {
    console.error("❌ PRIVATE_KEY required in environment");
    process.exit(1);
}

async function deploySingle() {
    const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
    const fullFileName = contractFileName.endsWith('.clar') ? contractFileName : `${contractFileName}.clar`;

    const contractPath = path.join(process.cwd(), 'contracts', fullFileName);
    console.log(`📄 Reading: ${contractPath}`);

    const contractSource = readFileSync(contractPath, 'utf-8');
    const contractSizeKB = (contractSource.length / 1024).toFixed(2);

    const timestamp = Date.now();
    const baseNameWithoutExt = fullFileName.replace('.clar', '');
    const contractName = `${baseNameWithoutExt}-${timestamp}`;

    console.log(`📝 Contract: ${contractName}`);
    console.log(`📊 Size: ${contractSizeKB} KB`);
    console.log(`💰 Fee: 1.00 STX\n`);

    const txOptions = {
        contractName,
        codeBody: contractSource,
        senderKey: PRIVATE_KEY,
        network,
        anchorMode: AnchorMode.Any,
        clarityVersion: ClarityVersion.Clarity3,
        fee: 1000000,
        postConditionMode: 0x01,
    };

    console.log("⏳  Creating transaction...");
    const transaction = await makeContractDeploy(txOptions);

    console.log("📤 Broadcasting...\n");
    const response = await broadcastTransaction({ transaction, network });

    if ('error' in response) {
        console.error(`❌ FAILED: ${response.error}`);
        if (response.reason) console.error(`Reason: ${response.reason}`);
        process.exit(1);
    }

    console.log(`✅ Transaction sent!`);
    console.log(`📋 TX ID: ${response.txid}`);
    console.log(`🔗 https://explorer.hiro.so/txid/${response.txid}?chain=${NETWORK_ENV}`);
    console.log(`📍 ${WALLET_ADDRESS}.${contractName}\n`);
}

deploySingle().catch(err => {
    console.error("❌ Error:", err.message);
    process.exit(1);
});

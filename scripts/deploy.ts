import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { readFileSync } from 'fs';
import path from 'path';

// Load environment variables (ensure to install dotenv if needed, or pass via command line)
// For simplicity, we'll check process.env directly.

const PRIVATE_KEY = process.env.DEPLOYER_KEY;
const NETWORK_ENV = process.env.STACKS_NETWORK || 'testnet'; // 'testnet' or 'mainnet'

if (!PRIVATE_KEY) {
    console.error("Error: DEPLOYER_KEY environment variable is required.");
    process.exit(1);
}

async function deployContract() {
    console.log(`Deploying to ${NETWORK_ENV}...`);

    const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

    // Read contract source code
    // Assuming script is run from project root, so contracts/ is at ./contracts
    const contractPath = path.join(process.cwd(), 'contracts', 'predinex-pool.clar');
    const contractSource = readFileSync(contractPath, 'utf-8');

    const contractName = 'predinex-pool-v2';

    console.log(`Contract: ${contractName}`);
    console.log(`Reading from: ${contractPath}`);

    const txOptions = {
        contractName,
        codeBody: contractSource,
        senderKey: PRIVATE_KEY!,
        network,
        anchorMode: AnchorMode.Any,
        fee: 100000, // Fee in microstacks. Adjust as needed or use estimate.
        postConditionMode: 0x01, // Allow
    };

    try {
        const transaction = await makeContractDeploy(txOptions);
        const broadcastResponse = await broadcastTransaction({ transaction, network });

        console.log('Broadcast response:', broadcastResponse);

        if ('error' in broadcastResponse) {
            console.error('Deployment failed:', broadcastResponse.error);
        } else {
            console.log('Contract deployed!');
            console.log('Transaction ID:', broadcastResponse.txid);
            // Note: Contract address depends on sender address and contract name
        }
    } catch (error) {
        console.error('Error deploying contract:', error);
    }
}

deployContract();

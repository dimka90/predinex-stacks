
import {
    makeContractDeploy,
    broadcastTransaction,
    AnchorMode,
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const network = STACKS_MAINNET;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY required");

async function deploy() {
    const code = fs.readFileSync('contracts/predinex-governance-alpha.clar', 'utf8');

    // Manual Nonce Override due to API flakiness
    const nonce = 926;
    console.log(`🚀 Deploying Governance Alpha with confirmed nonce ${nonce}...`);

    const txOptions = {
        contractName: 'predinex-governance-alpha',
        codeBody: code,
        senderKey: PRIVATE_KEY!,
        network,
        anchorMode: AnchorMode.Any,
        fee: 100000, // Priority fee
        nonce: nonce,
        clarityVersion: 2,
    };

    const transaction = await makeContractDeploy(txOptions);
    const result = await broadcastTransaction({ transaction });

    console.log('Deployment Result:', result);
}

deploy().catch(console.error);

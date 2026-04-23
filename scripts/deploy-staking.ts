
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
    const code = fs.readFileSync('contracts/predinex-staking-v1.clar', 'utf8');

    // Confirmed Nonce
    const nonce = 952;

    console.log(`🚀 Deploying Staking V1 with nonce ${nonce}...`);

    const txOptions = {
        contractName: 'predinex-staking-v1',
        codeBody: code,
        senderKey: PRIVATE_KEY,
        network,
        anchorMode: AnchorMode.Any,
        fee: 50000,
        nonce: nonce,
        clarityVersion: 2,
    };

    const transaction = await makeContractDeploy(txOptions);
    const result = await broadcastTransaction({ transaction });

    console.log('Deployment Result:', result);
}

deploy().catch(console.error);

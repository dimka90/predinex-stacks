
import { makeContractDeploy, broadcastTransaction, AnchorMode, ClarityVersion } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import { readFileSync } from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_NAME = `predinex-v2-master`;
const NONCE = 865; // Previous 864 was consumed by failed tx

async function deploy() {
    if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY required");

    const contractPath = path.join(process.cwd(), 'contracts', 'predinex-v2-master.clar');
    const codeBody = readFileSync(contractPath, 'utf-8');

    console.log(`🚀 Deploying V2 Master (Clarity 2): ${CONTRACT_NAME}`);
    console.log(`🔢 Nonce: ${NONCE}`);
    console.log(`💰 Fee: 1 STX (Priority)`);

    const txOptions = {
        contractName: CONTRACT_NAME,
        codeBody,
        senderKey: PRIVATE_KEY,
        network: STACKS_MAINNET,
        nonce: NONCE,
        anchorMode: AnchorMode.Any,
        clarityVersion: ClarityVersion.Clarity2,
        fee: 1000000,
    };

    const transaction = await makeContractDeploy(txOptions);
    const response = await broadcastTransaction({ transaction, network: STACKS_MAINNET });

    if ('error' in response) {
        console.error(`❌ Deployment Failed: ${response.error}`);
        process.exit(1);
    }

    console.log(`✅ BROADCAST SUCCESSFUL!`);
    console.log(`TX ID: ${response.txid}`);
    console.log(`🔗 https://explorer.hiro.so/txid/${response.txid}?chain=mainnet`);
}

deploy();

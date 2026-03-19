import {
    makeContractDeploy,
    broadcastTransaction,
    AnchorMode,
    PostConditionMode
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_NAME = 'metric-booster-v2';

if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY environment variable is required.");
    process.exit(1);
}

async function deployBooster() {
    console.log('\n🚀 Deploying Metric Booster v2 to Mainnet (Nonce 722)...');
    const code = fs.readFileSync('contracts/metric-booster.clar', 'utf8');

    const deployTx = await makeContractDeploy({
        contractName: CONTRACT_NAME,
        codeBody: code,
        senderKey: PRIVATE_KEY,
        network: STACKS_MAINNET,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        fee: 50000,
        nonce: 722,
    } as any);


    const result = await broadcastTransaction({ transaction: deployTx, network: STACKS_MAINNET });
    console.log('DEPLOY_RESULT:', result);
    if ('txid' in result) {
        console.log(`\n✅ Deployment Broadcasted! TX ID: ${result.txid}`);
        console.log(`🔗 https://explorer.hiro.so/txid/${result.txid}?chain=mainnet`);
    }
}

deployBooster().catch(console.error);

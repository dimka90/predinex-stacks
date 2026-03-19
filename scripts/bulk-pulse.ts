import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    PostConditionMode
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import * as dotenv from 'dotenv';
import { execSync } from 'child_process';
import * as fs from 'fs';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';
const CONTRACT_NAME = 'metric-booster-v2';

async function bulkPulse(count: number, startNonce: number, fee: number) {
    console.log(`\n⚡ Bulk Pulsing ${count} times (Start Nonce: ${startNonce}, Fee: ${fee})...`);

    for (let i = 0; i < count; i++) {
        const nonce = startNonce + i;
        console.log(`[${i + 1}/${count}] Broadcasting Pulse (Nonce: ${nonce})...`);

        try {
            const tx = await makeContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'pulse',
                functionArgs: [],
                senderKey: PRIVATE_KEY as string,
                network: STACKS_MAINNET,
                // @ts-ignore
                anchorMode: AnchorMode.Any,
                postConditionMode: PostConditionMode.Allow,
                fee: fee,
                nonce: nonce,
            } as any);

            const hex = tx.serialize().toString('hex');
            const binPath = `scripts/pulse-${nonce}.bin`;
            const hexPath = `scripts/pulse-${nonce}.hex`;

            fs.writeFileSync(hexPath, hex);
            execSync(`xxd -r -p ${hexPath} > ${binPath}`);

            const curlCmd = `curl -s -X POST https://api.mainnet.hiro.so/v2/transactions -H "Content-Type: application/octet-stream" --data-binary @${binPath}`;
            const result = execSync(curlCmd).toString();
            console.log(`   Result: ${result}`);

            // Cleanup
            fs.unlinkSync(binPath);
            fs.unlinkSync(hexPath);

            // Tiny delay between broadcasts
            await new Promise(r => setTimeout(r, 1000));
        } catch (e) {
            console.error(`   ❌ Failed at nonce ${nonce}:`, e);
        }
    }
}

const count = parseInt(process.argv[2]) || 10;
const startNonce = parseInt(process.argv[3]);
const fee = parseInt(process.argv[4]) || 10000;

if (isNaN(startNonce)) {
    console.error("Error: startNonce is required.");
    process.exit(1);
}

bulkPulse(count, startNonce, fee).catch(console.error);


import {
    getAddressFromPrivateKey,
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    uintCV,
    PostConditionMode,
    makeSTXTokenTransfer,
} from '@stacks/transactions';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as crypto from 'crypto';

dotenv.config();

const network = 'mainnet';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';
const CONTRACT_NAME = 'predinex-governance-alpha';

if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY required");

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const ARMY_B_FILE = 'predinex-army-b.json';

async function main() {
    const mode = process.argv[2]; // 'fund' or 'unleash'
    const mainAddress = getAddressFromPrivateKey(PRIVATE_KEY!);

    let army: { subKey: string, address: string }[] = [];
    if (fs.existsSync(ARMY_B_FILE)) {
        army = JSON.parse(fs.readFileSync(ARMY_B_FILE, 'utf-8'));
    } else {
        army = Array.from({ length: 25 }, (_, idx) => {
            const subKey = crypto.randomBytes(32).toString('hex');
            const address = getAddressFromPrivateKey(subKey);
            return { subKey, address };
        });
        fs.writeFileSync(ARMY_B_FILE, JSON.stringify(army, null, 2));
    }

    if (mode === 'fund') {
        console.log(`🚀 ARMY B FUNDING: 25 NEW USERS from ${mainAddress}`);
        const response = await fetch(`https://api.hiro.so/v2/accounts/${mainAddress}`);
        const data: any = await response.json();
        let nonce = data.nonce;

        for (const user of army) {
            console.log(`   Funding ${user.address} (Nonce ${nonce})`);
            const txOptions = {
                recipient: user.address,
                amount: 150000, // 0.15 STX
                senderKey: PRIVATE_KEY!,
                nonce,
                fee: 10000,
                anchorMode: AnchorMode.Any,
            };

            try {
                const transaction = await makeSTXTokenTransfer(txOptions);
                const res = await broadcastTransaction({ transaction });
                if ('error' in res) {
                    console.log(`   ❌ Error: ${res.error}`);
                    if (res.error === 'ConflictingNonceInMempool') { nonce++; }
                } else {
                    console.log(`   ✅ Sent: ${res.txid}`);
                    nonce++;
                }
            } catch (e) {
                console.log(`   ❌ Exception: ${e}`);
            }
            await sleep(1000);
        }
    } else if (mode === 'unleash') {
        console.log(`🚀 ARMY B UNLEASH: 25 NEW USERS ON ${CONTRACT_NAME}`);
        for (const user of army) {
            console.log(`   User ${user.address} interacting with Governance...`);
            for (let i = 0; i < 3; i++) {
                const txOptions = {
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: CONTRACT_NAME,
                    functionName: 'submit-proposal',
                    functionArgs: [crypto.randomBytes(20).toString('hex').padEnd(140, ' ')],
                    senderKey: user.subKey,
                    nonce: i,
                    fee: 20000,
                    anchorMode: AnchorMode.Any,
                };
                if (i > 0) {
                    txOptions.functionName = 'vote';
                    txOptions.functionArgs = [uintCV(1), uintCV(1)];
                }
                try {
                    const transaction = await makeContractCall(txOptions);
                    const res = await broadcastTransaction({ transaction });
                    console.log(`      [${i}] Tx sent: ${'txid' in res ? res.txid : res.error}`);
                } catch (e) {
                    console.log(`      [${i}] Call failed`);
                }
                await sleep(500);
            }
        }
    } else {
        console.log("Usage: npx tsx scripts/army-b-orchestrator.ts [fund|unleash]");
    }
}

main().catch(console.error);

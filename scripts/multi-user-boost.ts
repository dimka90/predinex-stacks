
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
const CONTRACT_NAME = 'predinex-v2-master';

if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY required");

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Army address persistence
const ARMY_FILE = 'predinex-army.json';

async function main() {
    const mode = process.argv[2]; // 'fund' or 'unleash'
    const mainAddress = getAddressFromPrivateKey(PRIVATE_KEY!);

    let army: { subKey: string, address: string }[] = [];
    if (fs.existsSync(ARMY_FILE)) {
        army = JSON.parse(fs.readFileSync(ARMY_FILE, 'utf-8'));
    } else {
        army = Array.from({ length: 60 }, (_, idx) => {
            const subKey = crypto.randomBytes(32).toString('hex');
            const address = getAddressFromPrivateKey(subKey);
            return { subKey, address };
        });
        fs.writeFileSync(ARMY_FILE, JSON.stringify(army, null, 2));
    }

    if (mode === 'fund') {
        console.log(`🚀 PHASE 1: FUNDING 60 USERS from ${mainAddress}`);
        const response = await fetch(`https://api.hiro.so/v2/accounts/${mainAddress}`);
        const data: any = await response.json();
        let nonce = data.nonce;

        for (const user of army) {
            console.log(`   Funding ${user.address} (Nonce ${nonce})`);
            const txOptions = {
                recipient: user.address,
                amount: 170000,
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
        console.log(`🚀 PHASE 2: UNLEASHING 60-USER ARMY ON ${CONTRACT_NAME}`);
        for (const user of army) {
            console.log(`   User ${user.address} performing interactions...`);
            for (let i = 0; i < 5; i++) { // Increased back to 5 for Day 3 Volume Surge
                const txOptions = {
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: CONTRACT_NAME,
                    functionName: 'place-bet',
                    functionArgs: [uintCV(i), uintCV(0), uintCV(1000)],
                    senderKey: user.subKey,
                    nonce: i,
                    fee: 20000,
                    anchorMode: AnchorMode.Any,
                    postConditionMode: PostConditionMode.Allow,
                };
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
        console.log("Usage: npx tsx scripts/multi-user-boost.ts [fund|unleash]");
    }
}

main().catch(console.error);

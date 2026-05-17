
import {
    getAddressFromPrivateKey,
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    uintCV,
    makeSTXTokenTransfer,
} from '@stacks/transactions';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as crypto from 'crypto';

dotenv.config();

const network = 'mainnet';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';
const CONTRACT_NAME = 'predinex-staking-v1';

if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY required");

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const ARMY_C_FILE = 'predinex-army-c.json';

async function main() {
    const mode = process.argv[2]; // 'fund' or 'unleash'
    const mainAddress = getAddressFromPrivateKey(PRIVATE_KEY!);

    let army: { subKey: string, address: string }[] = [];
    if (fs.existsSync(ARMY_C_FILE)) {
        army = JSON.parse(fs.readFileSync(ARMY_C_FILE, 'utf-8'));
    } else {
        army = Array.from({ length: 200 }, () => {
            const subKey = crypto.randomBytes(32).toString('hex');
            const address = getAddressFromPrivateKey(subKey);
            return { subKey, address };
        });
        fs.writeFileSync(ARMY_C_FILE, JSON.stringify(army, null, 2));
    }

    if (mode === 'fund') {
        console.log(`🚀 ARMY C FUNDING: 200 NEW USERS from ${mainAddress}`);
        const response = await fetch(`https://api.hiro.so/v2/accounts/${mainAddress}`);
        const data: any = await response.json();
        let nonce = data.nonce;
        console.log(`📡 Current On-chain Nonce: ${nonce}`);
        // If we just deployed, the API might still show the old nonce. 
        // We ensure we start at 953 if the API is lagging.
        if (nonce <= 952) { nonce = 953; console.log(`🔄 Force bumping nonce to ${nonce}`); }

        for (const user of army) {
            console.log(`   Funding ${user.address} (Nonce ${nonce})`);
            const txOptions = {
                recipient: user.address,
                amount: 40000, // 0.04 STX
                senderKey: PRIVATE_KEY!,
                nonce,
                fee: 10000,
                anchorMode: AnchorMode.Any,
            };

            try {
                const transaction = await makeSTXTokenTransfer(txOptions);
                const res = await broadcastTransaction({ transaction });
                if (res && 'error' in res && res.error) {
                    console.log(`   ❌ Error: ${res.error}`);
                    if (res.error === 'ConflictingNonceInMempool') { nonce++; }
                    else { await sleep(5000); }
                } else {
                    console.log(`   ✅ Sent: ${'txid' in res ? res.txid : 'Success'}`);
                    nonce++;
                }
            } catch (e) {
                console.log(`   ❌ Exception: ${e}`);
                await sleep(5000);
            }
            await sleep(2000); // Throttling protection
        }
    } else if (mode === 'unleash') {
        console.log(`🚀 ARMY C UNLEASH: 200 NEW USERS ON ${CONTRACT_NAME}`);
        for (const user of army) {
            console.log(`   User ${user.address} interacting with Staking...`);
            for (let i = 0; i < 2; i++) {
                const txOptions = {
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: CONTRACT_NAME,
                    functionName: 'stake',
                    functionArgs: [uintCV(100)],
                    senderKey: user.subKey,
                    nonce: i,
                    fee: 20000,
                    anchorMode: AnchorMode.Any,
                };
                if (i > 0) { txOptions.functionName = 'unstake'; }
                try {
                    const transaction = await makeContractCall(txOptions);
                    const res = await broadcastTransaction({ transaction });
                    console.log(`      [${i}] Tx sent: ${'txid' in res ? res.txid : res.error}`);
                } catch (e) {
                    console.log(`      [${i}] Call failed: ${e}`);
                    await sleep(3000);
                }
                await sleep(1000); // Throttling protection
            }
        }
    }
}

main().catch(console.error);

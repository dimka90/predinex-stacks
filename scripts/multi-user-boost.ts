
import {
    getAddressFromPrivateKey,
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    uintCV,
    PostConditionMode,
    makeSTXTokenTransfer,
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as crypto from 'crypto';

dotenv.config();

const network = STACKS_MAINNET;
const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';
const CONTRACT_NAME = process.env.CONTRACT_NAME || 'predinex-v2-master';
const ARMY_SIZE = Number(process.env.ARMY_SIZE || 60);
const FUNDING_AMOUNT_USTX = Number(process.env.SUB_WALLET_FUNDING_USTX || 170000);
const FUNDING_FEE_USTX = Number(process.env.FUNDING_FEE_USTX || 10000);
const SUB_TX_FEE_USTX = Number(process.env.SUB_TX_FEE_USTX || 20000);
const BET_AMOUNT_USTX = Number(process.env.SUB_WALLET_BET_USTX || 1000);
const BETS_PER_WALLET = Number(process.env.SUB_WALLET_TX_COUNT || 5);

if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY required");

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Army address persistence
const ARMY_FILE = 'predinex-army.json';

async function getAccountNonce(address: string): Promise<number> {
    const response = await fetch(`https://api.hiro.so/v2/accounts/${address}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch nonce for ${address}: HTTP ${response.status}`);
    }
    const data: any = await response.json();
    return Number(data.nonce ?? 0);
}

async function main() {
    const mode = process.argv[2]; // 'fund' or 'unleash'
    const mainAddress = getAddressFromPrivateKey(PRIVATE_KEY!);

    let army: { subKey: string, address: string }[] = [];
    if (fs.existsSync(ARMY_FILE)) {
        army = JSON.parse(fs.readFileSync(ARMY_FILE, 'utf-8'));
    } else {
        army = Array.from({ length: ARMY_SIZE }, () => {
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
                amount: FUNDING_AMOUNT_USTX,
                senderKey: PRIVATE_KEY!,
                nonce,
                fee: FUNDING_FEE_USTX,
                anchorMode: AnchorMode.Any,
            };

            try {
                const transaction = await makeSTXTokenTransfer(txOptions);
                const res = await broadcastTransaction({ transaction, network });
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
        console.log(`🚀 PHASE 2: UNLEASHING SUB-WALLETS ON ${CONTRACT_NAME}`);
        for (const user of army) {
            console.log(`   User ${user.address} performing interactions...`);
            let subNonce = await getAccountNonce(user.address);
            for (let i = 0; i < BETS_PER_WALLET; i++) {
                const txOptions = {
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: CONTRACT_NAME,
                    functionName: 'place-bet',
                    functionArgs: [uintCV(i), uintCV(0), uintCV(BET_AMOUNT_USTX)],
                    senderKey: user.subKey,
                    nonce: subNonce,
                    fee: SUB_TX_FEE_USTX,
                    anchorMode: AnchorMode.Any,
                    postConditionMode: PostConditionMode.Allow,
                };
                try {
                    const transaction = await makeContractCall(txOptions);
                    const res = await broadcastTransaction({ transaction, network });
                    console.log(`      [${i}] Tx sent: ${'txid' in res ? res.txid : res.error}`);
                    subNonce++;
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

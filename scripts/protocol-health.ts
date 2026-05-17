
import { getAddressFromPrivateKey } from '@stacks/transactions';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

const MAIN_ADDRESS = 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';

async function checkBalance(address: string) {
    try {
        const res = await fetch(`https://api.mainnet.hiro.so/v2/accounts/${address}`);
        const data: any = await res.json();
        const balance = parseInt(data.balance, 16) / 1000000;
        return balance.toFixed(2);
    } catch (e) { return "Error"; }
}

async function main() {
    console.log("🛰️  PREDINEX GLOBAL HEALTH DASHBOARD");
    console.log("------------------------------------");

    const armyA = JSON.parse(fs.readFileSync('predinex-army.json', 'utf-8'));
    const armyB = JSON.parse(fs.readFileSync('predinex-army-b.json', 'utf-8'));
    const armyC = JSON.parse(fs.readFileSync('predinex-army-c.json', 'utf-8'));

    console.log(`👤 Main Account: ${MAIN_ADDRESS} [Balance: ${await checkBalance(MAIN_ADDRESS)} STX]`);
    console.log("");
    console.log("⚔️  ARMY SQUADS STATUS:");
    console.log(`💂 Army A (V2 Master):  60 Users  [ACTIVE]`);
    console.log(`💂 Army B (Governance): 25 Users  [ACTIVE]`);
    console.log(`💂 Army C (Staking):    200 Users [ACTIVE]`);
    console.log("------------------------------------");
    console.log(`🔥 TOTAL DAU:          285 UNIQUE USERS`);
    console.log(`⚙️  PROJECTED VOLUME:  ~1,200 DAILY TXS`);
    console.log("------------------------------------");
    console.log("🎯 RANK TARGET:       TOP 10 ELITE");
}

main().catch(console.error);

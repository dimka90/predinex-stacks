#!/usr/bin/env tsx

/**
 * Real-World Oracle Feeder for Predinex
 * 
 * This script fetches live Bitcoin price data and submits it to the 
 * Predinex Oracle Registry, then triggers automated market resolution.
 */

import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    uintCV,
    stringAsciiCV,
    PostConditionMode
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import * as dotenv from 'dotenv';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
const CONTRACT_ADDRESS = 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';
const ORACLE_REGISTRY = 'predinex-oracle-registry-1769574272753';
const RESOLUTION_ENGINE = 'predinex-resolution-engine-1771298802385';
const NETWORK = STACKS_MAINNET;

if (!PRIVATE_KEY) {
    console.error("❌ PRIVATE_KEY not found in .env");
    process.exit(1);
}

async function fetchBtcPrice(): Promise<number> {
    console.log("🌐 Fetching BTC price from CoinGecko...");
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
        const data: any = await response.json();
        return data.bitcoin.usd;
    } catch (error) {
        console.error("❌ Failed to fetch BTC price:", error);
        throw error;
    }
}

async function submitData(poolId: number, price: number) {
    console.log(`📤 Submitting price $${price} for pool #${poolId}...`);

    const txOptions = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: ORACLE_REGISTRY,
        functionName: 'submit-oracle-data',
        functionArgs: [
            uintCV(poolId),
            stringAsciiCV(price.toString()),
            stringAsciiCV('price'),
            uintCV(100) // 100% confidence from official API
        ],
        senderKey: PRIVATE_KEY,
        validateWithAbi: true,
        network: NETWORK,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        fee: 1000000, // 1 STX
    };

    try {
        const transaction = await makeContractCall(txOptions);
        const broadcastResponse = await broadcastTransaction({ transaction, network: NETWORK });

        if ('error' in broadcastResponse) {
            console.error('❌ Data submission failed:', broadcastResponse.error);
            throw new Error(broadcastResponse.error);
        }

        console.log(`✅ Data submission broadcasted! TX: ${broadcastResponse.txid}`);
        return broadcastResponse.txid;
    } catch (error) {
        console.error("❌ Submission failed:", error);
        throw error;
    }
}

async function triggerResolution(poolId: number) {
    console.log(`⚖️ Triggering automated resolution for pool #${poolId}...`);

    const txOptions = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: RESOLUTION_ENGINE,
        functionName: 'attempt-automated-resolution',
        functionArgs: [uintCV(poolId)],
        senderKey: PRIVATE_KEY,
        validateWithAbi: true,
        network: NETWORK,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        fee: 1000000, // 1 STX
    };

    try {
        const transaction = await makeContractCall(txOptions);
        const broadcastResponse = await broadcastTransaction({ transaction, network: NETWORK });

        if ('error' in broadcastResponse) {
            console.error('❌ Resolution trigger failed:', broadcastResponse.error);
            throw new Error(broadcastResponse.error);
        }

        console.log(`✅ Resolution trigger broadcasted! TX: ${broadcastResponse.txid}`);
        return broadcastResponse.txid;
    } catch (error) {
        console.error("❌ Resolution trigger failed:", error);
        throw error;
    }
}


async function main() {
    const poolId = process.argv[2] ? parseInt(process.argv[2]) : 1;

    try {
        const price = await fetchBtcPrice();
        console.log(`💰 Current BTC Price: $${price}`);

        await submitData(poolId, price);

        // Wait for anchor or just trigger immediately (depending on contract logic)
        // Most contracts require data to be confirmed, but we'll try triggering for demonstration.
        console.log("⏳ Waiting 10 seconds before triggering resolution...");
        await new Promise(resolve => setTimeout(resolve, 10000));

        await triggerResolution(poolId);

        console.log("\n🎯 Oracle Feeder Task Complete!");
    } catch (error) {
        console.error("❌ Script failed:", error);
    }
}

main();

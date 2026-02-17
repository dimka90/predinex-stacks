/**
 * Batch interaction script with improved nonce management
 * Handles multiple transactions efficiently
 */

import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    uintCV,
    stringAsciiCV,
} from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import fetch from 'node-fetch';

const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet';
const CONTRACT_ADDRESS = process.env.WALLET_ADDRESS || 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';
const CONTRACT_NAME = process.env.LATEST_CONTRACT_NAME || 'predinex-pool-1766043971498';

if (!PRIVATE_KEY) {
    console.error('Error: PRIVATE_KEY environment variable is required.');
    process.exit(1);
}

interface BatchConfig {
    totalTransactions: number;
    delayMs: number;
    feePerTx: number;
    batchSize: number;
}

class BatchInteractor {
    private network: any;
    private currentNonce: number = 0;
    private successCount: number = 0;
    private failureCount: number = 0;
    private config: BatchConfig;

    constructor(config: BatchConfig) {
        this.network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
        this.config = config;
    }

    async fetchCurrentNonce(): Promise<number> {
        try {
            const apiUrl = this.network.coreApiUrl || 'https://api.mainnet.hiro.so';
            const response = await fetch(`${apiUrl}/v2/accounts/${CONTRACT_ADDRESS}?proof=0`);
            const data: any = await response.json();
            return data.nonce || 0;
        } catch (error) {
            console.error('Error fetching nonce:', error);
            return this.currentNonce;
        }
    }

    async sendTransaction(index: number, functionName: string, args: any[]): Promise<boolean> {
        try {
            const txOptions = {
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName,
                functionArgs: args,
                senderKey: PRIVATE_KEY!,
                network: this.network,
                anchorMode: AnchorMode.Any,
                fee: this.config.feePerTx,
                postConditionMode: 0x01,
                nonce: this.currentNonce,
            };

            const transaction = await makeContractCall(txOptions);
            const response = await broadcastTransaction({ transaction, network: this.network });

            if ('error' in response) {
                console.log(`  ❌ Tx ${index}: ${response.error}`);
                this.failureCount++;
                return false;
            } else {
                console.log(`  ✅ Tx ${index}: ${response.txid.slice(0, 16)}...`);
                this.successCount++;
                this.currentNonce++;
                return true;
            }
        } catch (error: any) {
            console.log(`  ❌ Tx ${index}: ${error.message}`);
            this.failureCount++;
            return false;
        }
    }

    async runBatch(): Promise<void> {
        console.log(`\n🚀 Starting batch interaction on ${NETWORK_ENV}`);
        console.log(`📊 Config: ${this.config.totalTransactions} txs, ${this.config.delayMs}ms delay\n`);

        this.currentNonce = await this.fetchCurrentNonce();
        console.log(`📍 Starting nonce: ${this.currentNonce}\n`);

        for (let i = 0; i < this.config.totalTransactions; i++) {
            const functionName = i % 2 === 0 ? 'create-pool' : 'register-user';
            const args = functionName === 'create-pool'
                ? [
                    stringAsciiCV(`Pool ${i}`),
                    stringAsciiCV(`Batch pool ${i}`),
                    stringAsciiCV('Yes'),
                    stringAsciiCV('No'),
                    uintCV(1000),
                ]
                : [];

            await this.sendTransaction(i + 1, functionName, args);

            if (i < this.config.totalTransactions - 1) {
                await new Promise(r => setTimeout(r, this.config.delayMs));
            }
        }

        this.printSummary();
    }

    private printSummary(): void {
        const total = this.successCount + this.failureCount;
        const successRate = ((this.successCount / total) * 100).toFixed(1);
        const totalCost = (this.config.feePerTx * this.successCount / 1_000_000).toFixed(4);

        console.log(`\n${'='.repeat(50)}`);
        console.log(`📈 Batch Summary`);
        console.log(`${'='.repeat(50)}`);
        console.log(`✅ Successful: ${this.successCount}/${total}`);
        console.log(`❌ Failed: ${this.failureCount}/${total}`);
        console.log(`📊 Success Rate: ${successRate}%`);
        console.log(`💰 Total Cost: ${totalCost} STX`);
        console.log(`${'='.repeat(50)}\n`);
    }
}

// Run batch
const config: BatchConfig = {
    totalTransactions: 50,
    delayMs: 3000,
    feePerTx: 150000,
    batchSize: 10,
};

const interactor = new BatchInteractor(config);
interactor.runBatch().catch(console.error);

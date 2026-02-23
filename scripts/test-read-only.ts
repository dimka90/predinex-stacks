import { fetchCallReadOnlyFunction, cvToJSON, uintCV, standardPrincipalCV } from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import dotenv from 'dotenv';

dotenv.config();

const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';
const CONTRACT_NAME = process.env.MAIN_POOL_CONTRACT || 'predinex-pool-1771736899021';
const WALLET_ADDRESS = process.env.WALLET_ADDRESS || 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';

async function verifyReadOnly() {
    const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

    console.log(`🔍 Verifying read-only functions for: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
    console.log(`🌐 Network: ${NETWORK_ENV}\n`);

    const functions = [
        { name: 'get-pool-counter', args: [] },
        { name: 'get-total-volume', args: [] },
        { name: 'get-pool-details', args: [uintCV(0)] },
        { name: 'get-user-claim-status', args: [uintCV(0), standardPrincipalCV(WALLET_ADDRESS)] }
    ];

    for (const fn of functions) {
        try {
            console.log(`📡 Calling ${fn.name}...`);
            const result = await fetchCallReadOnlyFunction({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: fn.name,
                functionArgs: fn.args,
                network,
                senderAddress: WALLET_ADDRESS,
            });

            console.log(`✅ Result:`, JSON.stringify(cvToJSON(result), null, 2));
        } catch (error: any) {
            console.error(`❌ Error calling ${fn.name}:`, error.message);
        }
        console.log('---');
    }
}

verifyReadOnly().catch(console.error);

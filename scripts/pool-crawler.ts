import { STACKS_MAINNET } from '@stacks/network';
import { callReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';

const CONTRACT_ADDRESS = 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';
const CONTRACT_NAME = 'predinex-pool';

async function crawlPools(startId: number = 0, count: number = 10) {
    console.log(`🔍 Crawling pools starting from ID: ${startId}...`);

    for (let i = startId; i < startId + count; i++) {
        try {
            const result = await callReadOnlyFunction({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'get-pool-details',
                functionArgs: [uintCV(i)],
                network: STACKS_MAINNET,
                senderAddress: CONTRACT_ADDRESS,
            });

            const json = cvToJSON(result);
            if (json.value) {
                console.log(`✅ Pool ${i}: ${json.value.title.value}`);
            } else {
                console.log(`❌ Pool ${i} not found.`);
                break;
            }
        } catch (e) {
            console.error(`Error fetching pool ${i}:`, e.message);
        }
    }
}

crawlPools(0, 50).catch(console.error);

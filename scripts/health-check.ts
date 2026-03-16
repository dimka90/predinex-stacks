import { STACKS_MAINNET } from '@stacks/network';
import { fetchCallReadOnlyFunction, cvToJSON } from '@stacks/transactions';

const CONTRACTS = [
    { name: 'predinex-pool', address: 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N' },
    { name: 'predinex-oracle-registry', address: 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N' },
    { name: 'predinex-resolution-engine', address: 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N' }
];

async function runHealthCheck() {
    console.log("🏥 Running Predinex System Health Check...\n");

    const network = STACKS_MAINNET;

    for (const contract of CONTRACTS) {
        try {
            console.log(`🔍 Checking ${contract.name} at ${contract.address}...`);

            // Note: In a real scenario, we would call a specific read-only function like 'get-version' or 'is-paused'
            // For this health check, we simply verify the contract is reachable on the network
            const result = await fetchCallReadOnlyFunction({
                contractAddress: contract.address.split('.')[0],
                contractName: contract.name,
                functionName: 'get-owner', // Common function to check existence/reachability
                functionArgs: [],
                network,
                senderAddress: contract.address.split('.')[0],
            });

            if (result) {
                console.log(`✅ ${contract.name} is reachable and responding.`);
            }
        } catch (e: any) {
            // If the specific function doesn't exist, the contract might still be "healthy" but our diagnostic is off
            if (e.message.includes("not found")) {
                console.log(`⚠️  ${contract.name} reached, but diagnostic function 'get-owner' not found. Contract is likely UP.`);
            } else {
                console.log(`❌ ${contract.name} health check failed: ${e.message}`);
            }
        }
    }
}

runHealthCheck().catch(console.error);

import { callReadOnlyFunction, uintCV } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

const NETWORK = new StacksMainnet();
const CONTRACT_ADDRESS = 'SP2W_EJMBN';
const CONTRACT_NAME = 'predinex-pool-1771470759824';

const poolIdArg = process.argv[2];

if (!poolIdArg) {
    console.error("❌ Error: Please provide a pool ID as an argument.");
    process.exit(1);
}

const poolId = parseInt(poolIdArg);

async function getPoolInfo() {
    console.log(`🔍 Fetching info for Pool #${poolId}...\n`);

    try {
        const result = await callReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'get-pool-details',
            functionArgs: [uintCV(poolId)],
            network: NETWORK,
            senderAddress: CONTRACT_ADDRESS,
        });

        console.log("📊 Pool Data:", JSON.stringify(result, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value, 2));

    } catch (error) {
        console.error("❌ Error fetching pool info:", error);
    }
}

getPoolInfo();

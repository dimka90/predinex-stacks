import fetch from 'node-fetch';

const CONTRACT_ADDRESS = 'SP2W_EJMBN';
const CONTRACTS = [
    'predinex-pool-1771470759824',
    'predinex-oracle-registry',
    'predinex-resolution-engine',
    'liquidity-incentives'
];

async function verifyDeployment() {
    console.log(`🚀 Verifying Deployment for: ${CONTRACT_ADDRESS}\n`);

    for (const name of CONTRACTS) {
        try {
            const response = await fetch(
                `https://api.mainnet.hiro.so/v2/contracts/interface/${CONTRACT_ADDRESS}.${name}`
            );

            if (response.ok) {
                console.log(`✅ ${name}: DEPLOYED`);
            } else {
                console.log(`❌ ${name}: NOT FOUND (${response.status})`);
            }
        } catch (error) {
            console.error(`❌ Error verifying ${name}:`, error);
        }
    }
}

verifyDeployment();

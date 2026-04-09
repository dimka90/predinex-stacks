import fetch from 'node-fetch';

const ADDRESSES = process.argv.slice(2).length > 0 ? process.argv.slice(2) : [process.env.WALLET_ADDRESS || 'SPENV2J0V4BHRFAZ6FVF97K9ZGQJ0GT19RC3JFN7'];

async function checkBalance() {
    console.log(`💰 Checking balances for Predinex Operators...\n`);

    for (const address of ADDRESSES) {
        try {
            console.log(`-------------------------------------------`);
            console.log(`🔍 Address: ${address}`);
            const response = await fetch(
                `https://api.mainnet.hiro.so/v2/accounts/${address}?proof=0`
            );

            if (!response.ok) {
                console.error(`❌ Error fetching ${address}: ${response.status} ${response.statusText}`);
                continue;
            }

            const data = await response.json() as any;

            const nonceResponse = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${address}/nonces`);
            const nonceData = await nonceResponse.json() as any;
            const nextNonce = nonceData.possible_next_nonce ?? data.nonce;

            console.log(`   Balance: ${data.balance} microSTX (${(parseInt(data.balance) / 1000000).toFixed(6)} STX)`);
            console.log(`   On-Chain Nonce: ${data.nonce} | Next Safe Nonce: ${nextNonce}`);

            if (nonceData.detected_missing_nonces && nonceData.detected_missing_nonces.length > 0) {
                console.log(`   ⚠️  WARNING: Nonce gap detected in mempool! Missing: ${nonceData.detected_missing_nonces.join(', ')}`);
            }

            if (data.balance === '0') {
                console.log(`   ⚠️  WARNING: Zero balance! Funding required.`);
            } else {
                const balanceSTX = parseInt(data.balance) / 1000000;
                const estimatedTxs = Math.floor(balanceSTX / 0.1);
                console.log(`   ✅ Sufficient for ~${estimatedTxs} standard transactions.`);
            }
        } catch (error) {
            console.error(`   ❌ Error checking ${address}:`, error);
        }
    }
    console.log(`-------------------------------------------\n`);
}

checkBalance();

// Added verbose flag support
const verbose = process.argv.includes('--verbose');
if (verbose) console.log('[check-balance] verbose mode enabled');

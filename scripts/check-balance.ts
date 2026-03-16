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

            console.log(`   Balance: ${data.balance} microSTX (${(parseInt(data.balance) / 1000000).toFixed(6)} STX)`);
            console.log(`   Nonce: ${data.nonce} | Txs: ${data.tx_count}`);

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
    } catch (error) {
    console.error(`❌ Error checking balance:`, error);
}
}

checkBalance();

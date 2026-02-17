import fetch from 'node-fetch';

const WALLET_ADDRESS = process.env.WALLET_ADDRESS || 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';

async function checkBalance() {
    console.log(`💰 Checking balance for: ${WALLET_ADDRESS}\n`);

    try {
        const response = await fetch(
            `https://api.mainnet.hiro.so/v2/accounts/${WALLET_ADDRESS}?proof=0`
        );

        if (!response.ok) {
            console.error(`❌ Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error(text);
            return;
        }

        const data = await response.json() as any;

        console.log(`📊 Account Information:`);
        console.log(`   Address: ${data.address}`);
        console.log(`   Balance: ${data.balance} microSTX (${(parseInt(data.balance) / 1000000).toFixed(6)} STX)`);
        console.log(`   Locked: ${data.locked} microSTX`);
        console.log(`   Nonce: ${data.nonce}`);
        console.log(`   Transaction Count: ${data.tx_count}`);
        
        if (data.balance === '0') {
            console.log(`\n⚠️  WARNING: Your balance is 0! You need STX to pay for transactions.`);
            console.log(`   Get testnet STX from: https://faucet.stacks.org/`);
            console.log(`   Or get mainnet STX from an exchange.`);
        } else {
            const balanceSTX = parseInt(data.balance) / 1000000;
            const estimatedTxs = Math.floor(balanceSTX / 0.1); // Assuming ~0.1 STX per tx
            console.log(`\n✅ You have enough balance for approximately ${estimatedTxs} transactions`);
        }
    } catch (error) {
        console.error(`❌ Error checking balance:`, error);
    }
}

checkBalance();

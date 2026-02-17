import fetch from 'node-fetch';

const WALLET_ADDRESS = 'SPENV2J0V4BHRFAZ6FVF97K9ZGQJ0GT19RC3JFN7';

async function analyzeTransactions() {
    console.log(`📊 Analyzing transaction history for: ${WALLET_ADDRESS}\n`);

    try {
        // Get recent transactions
        const response = await fetch(
            `https://api.mainnet.hiro.so/v2/accounts/${WALLET_ADDRESS}/transactions?limit=50`
        );

        if (!response.ok) {
            console.error(`❌ Error: ${response.status}`);
            return;
        }

        const data = await response.json() as any;

        console.log(`📋 Recent Transactions: ${data.results?.length || 0}\n`);

        if (data.results && data.results.length > 0) {
            let totalSpent = 0;
            let successCount = 0;
            let failCount = 0;

            data.results.forEach((tx: any, idx: number) => {
                const fee = parseInt(tx.fee_rate || '0');
                const status = tx.tx_status;
                
                if (status === 'success') successCount++;
                else failCount++;
                
                totalSpent += fee;

                console.log(`${idx + 1}. TX: ${tx.tx_id.substring(0, 16)}...`);
                console.log(`   Status: ${status}`);
                console.log(`   Fee: ${fee} microSTX (${(fee / 1000000).toFixed(6)} STX)`);
                console.log(`   Type: ${tx.tx_type}`);
                if (tx.contract_call) {
                    console.log(`   Function: ${tx.contract_call.function_name}`);
                }
                console.log();
            });

            console.log(`\n📊 Summary:`);
            console.log(`   ✅ Successful: ${successCount}`);
            console.log(`   ❌ Failed: ${failCount}`);
            console.log(`   💸 Total fees spent: ${totalSpent} microSTX (${(totalSpent / 1000000).toFixed(6)} STX)`);
        }

        // Get current balance
        const balResponse = await fetch(
            `https://api.mainnet.hiro.so/v2/accounts/${WALLET_ADDRESS}?proof=0`
        );
        const balData = await balResponse.json() as any;
        const balance = parseInt(balData.balance, 16);
        
        console.log(`\n💰 Current Balance: ${balance} microSTX (${(balance / 1000000).toFixed(6)} STX)`);
        console.log(`   Nonce: ${balData.nonce}`);
        
        const costPerBet = 1000000 + 100000; // 1 STX bet + 0.1 STX fee
        const possibleBets = Math.floor(balance / costPerBet);
        console.log(`\n📈 With current balance, you can place approximately ${possibleBets} more bets`);
        
    } catch (error) {
        console.error(`❌ Error:`, error);
    }
}

analyzeTransactions();

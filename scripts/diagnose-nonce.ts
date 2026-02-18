/**
 * Diagnostic script to check nonce and account status
 * Helps troubleshoot transaction rejection issues
 */

import fetch from 'node-fetch';

const WALLET_ADDRESS = process.env.WALLET_ADDRESS || 'SPENV2J0V4BHRFAZ6FVF97K9ZGQJ0GT19RC3JFN7';
const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet';

async function diagnoseNonce() {
    console.log('\n🔍 Stacks Account Diagnostic Tool\n');
    console.log(`Wallet: ${WALLET_ADDRESS}`);
    console.log(`Network: ${NETWORK_ENV}\n`);

    const apiUrl = NETWORK_ENV === 'mainnet' 
        ? 'https://api.mainnet.hiro.so'
        : 'https://api.testnet.hiro.so';

    try {
        // Fetch account info
        console.log('📊 Fetching account information...\n');
        const response = await fetch(`${apiUrl}/v2/accounts/${WALLET_ADDRESS}?proof=0`);
        const data: any = await response.json();

        console.log('✅ Account Information:');
        console.log(`   Nonce: ${data.nonce}`);
        console.log(`   Balance: ${(data.balance / 1_000_000).toFixed(6)} STX`);
        console.log(`   Locked: ${(data.locked / 1_000_000).toFixed(6)} STX`);
        console.log(`   Unlocked: ${(data.unlocked / 1_000_000).toFixed(6)} STX`);
        console.log(`   Transaction Count: ${data.tx_count}`);
        console.log(`   Block Height: ${data.block_height}\n`);

        // Check if balance is sufficient
        const balanceSTX = data.balance / 1_000_000;
        if (balanceSTX < 0.1) {
            console.log('⚠️  WARNING: Balance is very low!');
            console.log(`   You have ${balanceSTX.toFixed(6)} STX`);
            console.log('   Minimum recommended: 0.1 STX per transaction\n');
        }

        // Fetch recent transactions
        console.log('📝 Fetching recent transactions...\n');
        const txResponse = await fetch(`${apiUrl}/v2/accounts/${WALLET_ADDRESS}/transactions?limit=10`);
        const txData: any = await txResponse.json();

        if (txData.results && txData.results.length > 0) {
            console.log('✅ Recent Transactions:');
            txData.results.slice(0, 5).forEach((tx: any, index: number) => {
                const status = tx.tx_status === 'success' ? '✓' : '✗';
                console.log(`   ${index + 1}. ${status} ${tx.tx_id.slice(0, 16)}... (${tx.tx_status})`);
            });
            console.log('');
        }

        // Recommendations
        console.log('💡 Recommendations:\n');
        
        if (data.nonce > 0) {
            console.log(`   ✓ Your nonce is ${data.nonce}`);
            console.log('   ✓ Next transaction should use nonce: ' + data.nonce);
        }

        if (balanceSTX >= 10) {
            console.log('   ✓ You have sufficient balance for many transactions');
        } else if (balanceSTX >= 1) {
            console.log('   ⚠️  You have limited balance, use wisely');
        } else {
            console.log('   ❌ You need more STX to continue');
        }

        console.log('   ✓ Use 3+ second delays between transactions');
        console.log('   ✓ Explicitly set nonce to avoid conflicts');
        console.log('   ✓ Monitor transaction status on explorer\n');

        // Explorer link
        const explorerUrl = NETWORK_ENV === 'mainnet'
            ? `https://explorer.hiro.so/address/${WALLET_ADDRESS}`
            : `https://explorer.hiro.so/address/${WALLET_ADDRESS}?chain=testnet`;
        
        console.log(`🔗 View on Explorer: ${explorerUrl}\n`);

    } catch (error: any) {
        console.error('❌ Error fetching account info:', error.message);
        console.log('\nPossible causes:');
        console.log('  1. Invalid wallet address');
        console.log('  2. Network connectivity issue');
        console.log('  3. API rate limit exceeded');
        console.log('  4. Wallet address has no transactions yet\n');
    }
}

diagnoseNonce().catch(console.error);

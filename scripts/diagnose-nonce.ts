/**
 * Diagnostic script to check nonce and account status
 * Helps troubleshoot transaction rejection issues
 */

import fetch from 'node-fetch';

const WALLET_ADDRESS = process.env.WALLET_ADDRESS || 'SPENV2J0V4BHRFAZ6FVF97K9ZGQJ0GT19RC3JFN7';
const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet';

async function diagnoseNonce() {
    console.info('\n🔍 Stacks Account Diagnostic Tool\n');
    console.info(`Wallet: ${WALLET_ADDRESS}`);
    console.info(`Network: ${NETWORK_ENV}\n`);

    const apiUrl = NETWORK_ENV === 'mainnet' 
        ? 'https://api.mainnet.hiro.so'
        : 'https://api.testnet.hiro.so';

    try {
        // Fetch account info
        console.info('📊 Fetching account information...\n');
        const response = await fetch(`${apiUrl}/v2/accounts/${WALLET_ADDRESS}?proof=0`);
        const data: any = await response.json();

        console.info('✅ Account Information:');
        console.info(`   Nonce: ${data.nonce}`);
        console.info(`   Balance: ${(data.balance / 1_000_000).toFixed(6)} STX`);
        console.info(`   Locked: ${(data.locked / 1_000_000).toFixed(6)} STX`);
        console.info(`   Unlocked: ${(data.unlocked / 1_000_000).toFixed(6)} STX`);
        console.info(`   Transaction Count: ${data.tx_count}`);
        console.info(`   Block Height: ${data.block_height}\n`);

        // Check if balance is sufficient
        const balanceSTX = data.balance / 1_000_000;
        if (balanceSTX < 0.1) {
            console.info('⚠️  WARNING: Balance is very low!');
            console.info(`   You have ${balanceSTX.toFixed(6)} STX`);
            console.info('   Minimum recommended: 0.1 STX per transaction\n');
        }

        // Fetch recent transactions
        console.info('📝 Fetching recent transactions...\n');
        const txResponse = await fetch(`${apiUrl}/v2/accounts/${WALLET_ADDRESS}/transactions?limit=10`);
        const txData: any = await txResponse.json();

        if (txData.results && txData.results.length > 0) {
            console.info('✅ Recent Transactions:');
            txData.results.slice(0, 5).forEach((tx: any, index: number) => {
                const status = tx.tx_status === 'success' ? '✓' : '✗';
                console.info(`   ${index + 1}. ${status} ${tx.tx_id.slice(0, 16)}... (${tx.tx_status})`);
            });
            console.info('');
        }

        // Recommendations
        console.info('💡 Recommendations:\n');
        
        if (data.nonce > 0) {
            console.info(`   ✓ Your nonce is ${data.nonce}`);
            console.info('   ✓ Next transaction should use nonce: ' + data.nonce);
        }

        if (balanceSTX >= 10) {
            console.info('   ✓ You have sufficient balance for many transactions');
        } else if (balanceSTX >= 1) {
            console.info('   ⚠️  You have limited balance, use wisely');
        } else {
            console.info('   ❌ You need more STX to continue');
        }

        console.info('   ✓ Use 3+ second delays between transactions');
        console.info('   ✓ Explicitly set nonce to avoid conflicts');
        console.info('   ✓ Monitor transaction status on explorer\n');

        // Explorer link
        const explorerUrl = NETWORK_ENV === 'mainnet'
            ? `https://explorer.hiro.so/address/${WALLET_ADDRESS}`
            : `https://explorer.hiro.so/address/${WALLET_ADDRESS}?chain=testnet`;
        
        console.info(`🔗 View on Explorer: ${explorerUrl}\n`);

    } catch (error: any) {
        console.error('❌ Error fetching account info:', error.message);
        console.info('\nPossible causes:');
        console.info('  1. Invalid wallet address');
        console.info('  2. Network connectivity issue');
        console.info('  3. API rate limit exceeded');
        console.info('  4. Wallet address has no transactions yet\n');
    }
}

diagnoseNonce().catch(console.error);

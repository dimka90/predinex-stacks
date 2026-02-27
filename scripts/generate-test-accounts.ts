import { generateWallet, generateAccount } from '@stacks/wallet-sdk';

async function generateTestAccounts(count: number = 5) {
    console.log(`🔑 Generating ${count} Test Accounts...\n`);

    const wallet = await generateWallet({
        password: 'password',
        secretKey: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon'
    });

    for (let i = 0; i < count; i++) {
        const account = generateAccount(wallet);
        console.log(`👤 Account #${i + 1}:`);
        console.log(`   Address: ${account.stxAddress}`);
        // console.log(`   Private Key: ${account.stxPrivateKey}`);
        console.log(`   ---`);
    }
}

const countArg = parseInt(process.argv[2]) || 5;
generateTestAccounts(countArg);

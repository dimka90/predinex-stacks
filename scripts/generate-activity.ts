import { 
    makeContractCall, 
    broadcastTransaction, 
    AnchorMode,
    stringAsciiCV,
    uintCV
} from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import * as readline from 'readline';

const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_KEY;
const NETWORK_ENV = process.env.STACKS_NETWORK || 'mainnet';
const CONTRACT_ADDRESS = process.env.WALLET_ADDRESS || 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';
const CONTRACT_NAME = 'predinex-pool';

if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY environment variable is required.");
    process.exit(1);
}

const SENDER_KEY = PRIVATE_KEY as string;

const network = NETWORK_ENV === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
const networkName = NETWORK_ENV === 'mainnet' ? 'Mainnet' : 'Testnet';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function createPool() {
    console.log('\n📝 Creating a new prediction pool...\n');
    
    const title = await question('Pool title (e.g., "Will BTC hit $100k?"): ');
    const description = await question('Description: ');
    const outcomeA = await question('Outcome A (e.g., "Yes"): ');
    const outcomeB = await question('Outcome B (e.g., "No"): ');
    const durationStr = await question('Duration in blocks (e.g., 1000): ');
    
    const duration = parseInt(durationStr);
    
    if (!title || !description || !outcomeA || !outcomeB || isNaN(duration)) {
        console.error('❌ Invalid input');
        return;
    }

    try {
        console.log('\n⏳ Creating transaction...');
        
        // Validate string lengths (Clarity limits)
        if (title.length > 256) {
            console.error('❌ Title too long (max 256 characters)');
            return;
        }
        if (description.length > 512) {
            console.error('❌ Description too long (max 512 characters)');
            return;
        }
        if (outcomeA.length > 128) {
            console.error('❌ Outcome A too long (max 128 characters)');
            return;
        }
        if (outcomeB.length > 128) {
            console.error('❌ Outcome B too long (max 128 characters)');
            return;
        }
        
        const txOptions = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'create-pool',
            functionArgs: [
                stringAsciiCV(title),
                stringAsciiCV(description),
                stringAsciiCV(outcomeA),
                stringAsciiCV(outcomeB),
                uintCV(duration)
            ],
            senderKey: SENDER_KEY,
            network,
            anchorMode: AnchorMode.Any,
            fee: 100000,
        };

        const transaction = await makeContractCall(txOptions);
        const broadcastResponse = await broadcastTransaction({ transaction, network });

        if ('error' in broadcastResponse) {
            console.error('❌ Failed:', broadcastResponse.error);
        } else {
            console.log('✅ Pool created!');
            console.log(`📋 TX ID: ${broadcastResponse.txid}`);
            console.log(`🔗 https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=${NETWORK_ENV}`);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

async function placeBet() {
    console.log('\n💰 Placing a bet...\n');
    
    const poolIdStr = await question('Pool ID: ');
    const outcomeStr = await question('Outcome (0 or 1): ');
    const amountStr = await question('Amount in STX (e.g., 1): ');
    
    const poolId = parseInt(poolIdStr);
    const outcome = parseInt(outcomeStr);
    const amount = Math.floor(parseFloat(amountStr) * 1000000); // Convert to microstacks
    
    if (isNaN(poolId) || isNaN(outcome) || isNaN(amount)) {
        console.error('❌ Invalid input');
        return;
    }

    try {
        console.log('\n⏳ Creating transaction...');
        
        const txOptions = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'place-bet-validated',
            functionArgs: [
                uintCV(poolId),
                uintCV(outcome),
                uintCV(amount)
            ],
            senderKey: SENDER_KEY,
            network,
            anchorMode: AnchorMode.Any,
            fee: 100000,
        };

        const transaction = await makeContractCall(txOptions);
        const broadcastResponse = await broadcastTransaction({ transaction, network });

        if ('error' in broadcastResponse) {
            console.error('❌ Failed:', broadcastResponse.error);
        } else {
            console.log('✅ Bet placed!');
            console.log(`📋 TX ID: ${broadcastResponse.txid}`);
            console.log(`🔗 https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=${NETWORK_ENV}`);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

async function settlePool() {
    console.log('\n🏁 Settling a pool...\n');
    
    const poolIdStr = await question('Pool ID: ');
    const winningOutcomeStr = await question('Winning outcome (0 or 1): ');
    
    const poolId = parseInt(poolIdStr);
    const winningOutcome = parseInt(winningOutcomeStr);
    
    if (isNaN(poolId) || isNaN(winningOutcome)) {
        console.error('❌ Invalid input');
        return;
    }

    try {
        console.log('\n⏳ Creating transaction...');
        
        const txOptions = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'settle-pool-enhanced',
            functionArgs: [
                uintCV(poolId),
                uintCV(winningOutcome)
            ],
            senderKey: SENDER_KEY,
            network,
            anchorMode: AnchorMode.Any,
            fee: 100000,
        };

        const transaction = await makeContractCall(txOptions);
        const broadcastResponse = await broadcastTransaction({ transaction, network });

        if ('error' in broadcastResponse) {
            console.error('❌ Failed:', broadcastResponse.error);
        } else {
            console.log('✅ Pool settled!');
            console.log(`📋 TX ID: ${broadcastResponse.txid}`);
            console.log(`🔗 https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=${NETWORK_ENV}`);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

async function main() {
    console.log('\n🎯 Predinex Activity Generator');
    console.log(`📍 Network: ${networkName}`);
    console.log(`📦 Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}\n`);
    
    console.log('Choose an action:');
    console.log('1. Create Pool');
    console.log('2. Place Bet');
    console.log('3. Settle Pool');
    console.log('4. Exit\n');
    
    const choice = await question('Enter choice (1-4): ');
    
    switch (choice) {
        case '1':
            await createPool();
            break;
        case '2':
            await placeBet();
            break;
        case '3':
            await settlePool();
            break;
        case '4':
            console.log('👋 Goodbye!');
            break;
        default:
            console.log('❌ Invalid choice');
    }
    
    rl.close();
}

main().catch(console.error);

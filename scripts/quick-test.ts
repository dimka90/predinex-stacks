import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    uintCV,
    stringAsciiCV
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.WALLET_ADDRESS;
const CONTRACT_NAME = process.env.LATEST_CONTRACT_NAME;

async function test() {
    const network = STACKS_MAINNET;
    
    const args = [
        stringAsciiCV("Test"),
        stringAsciiCV("Test"),
        stringAsciiCV("Yes"),
        stringAsciiCV("No"),
        uintCV(10000)
    ];

    const tx = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'create-pool',
        functionArgs: args,
        senderKey: PRIVATE_KEY,
        network,
        anchorMode: AnchorMode.Any,
        fee: 100000,
        postConditionMode: 0x01,
    };

    try {
        const transaction = await makeContractCall(tx);
        const response = await broadcastTransaction({ transaction, network });
        console.log(JSON.stringify(response, null, 2));
    } catch (err: any) {
        console.error(err.message);
    }
}

test();

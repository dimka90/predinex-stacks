
import * as transactions from '@stacks/transactions';
import { randomBytes } from 'crypto';

const hex = randomBytes(32).toString('hex');
const address = transactions.getAddressFromPrivateKey(hex);
console.log('NEW_PRIVATE_KEY:', hex);
console.log('NEW_ADDRESS:', address);

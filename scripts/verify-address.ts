
import { getAddressFromPrivateKey } from '@stacks/transactions';
const key = '06b91cb852079c36fdafd5aace98de31e93c344c0719995926de55f1d96b635b01';
try {
    const address = getAddressFromPrivateKey(key);
    console.log('REAL_ADDRESS:', address);
} catch (e) {
    console.log('ERROR:', e.message);
}

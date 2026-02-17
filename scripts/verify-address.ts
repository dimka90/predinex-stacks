
import { getAddressFromPrivateKey } from '@stacks/transactions';
const key = 'REDACTED_PRIVATE_KEY';
try {
    const address = getAddressFromPrivateKey(key);
    console.log('REAL_ADDRESS:', address);
} catch (e) {
    console.log('ERROR:', e.message);
}

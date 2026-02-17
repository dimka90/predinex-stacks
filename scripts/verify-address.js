
const { getAddressFromPrivateKey, TransactionVersion } = require('@stacks/transactions');
const key = 'REDACTED_PRIVATE_KEY';
const address = getAddressFromPrivateKey(key, TransactionVersion.Mainnet);
console.log('Mainnet Address:', address);

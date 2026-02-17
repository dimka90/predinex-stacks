
const { getAddressFromPrivateKey, TransactionVersion } = require('@stacks/transactions');
const key = '06b91cb852079c36fdafd5aace98de31e93c344c0719995926de55f1d96b635b01';
const address = getAddressFromPrivateKey(key, TransactionVersion.Mainnet);
console.log('Mainnet Address:', address);

const required = ["STACKS_PRIVATE_KEY", "STACKS_NETWORK", "CONTRACT_ADDRESS"];
const missing = required.filter(k => !process.env[k]);
if (missing.length) { console.error("Missing env vars:", missing.join(", ")); process.exit(1); }
console.log("Environment validated successfully.");

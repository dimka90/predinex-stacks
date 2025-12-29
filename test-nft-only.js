// Simple test runner for NFT contract only
const { execSync } = require('child_process');

try {
  console.log('Running NFT token tests...');
  
  // Create a temporary Clarinet.toml with only NFT contract
  const fs = require('fs');
  const originalConfig = fs.readFileSync('Clarinet.toml', 'utf8');
  
  const nftOnlyConfig = `[project]
name = 'predinex-stacks'
description = ''
authors = []
telemetry = true
cache_dir = './.cache'
requirements = []

[contracts.nft-token]
path = 'contracts/nft-token.clar'
clarity_version = 2
epoch = 'latest'

[repl.analysis]
passes = ['check_checker']

[repl.analysis.lints]

[repl.analysis.check_checker]
strict = false
trusted_sender = false
trusted_caller = false
callee_filter = false

[repl.remote_data]
enabled = false
api_url = 'https://api.hiro.so'
`;

  // Backup original and write NFT-only config
  fs.writeFileSync('Clarinet.toml.backup', originalConfig);
  fs.writeFileSync('Clarinet.toml', nftOnlyConfig);
  
  // Run the tests
  const result = execSync('npm test -- tests/nft-token.test.ts', { 
    encoding: 'utf8',
    stdio: 'inherit'
  });
  
  console.log('Tests completed successfully!');
  
} catch (error) {
  console.error('Test failed:', error.message);
} finally {
  // Restore original config
  const fs = require('fs');
  if (fs.existsSync('Clarinet.toml.backup')) {
    const originalConfig = fs.readFileSync('Clarinet.toml.backup', 'utf8');
    fs.writeFileSync('Clarinet.toml', originalConfig);
    fs.unlinkSync('Clarinet.toml.backup');
  }
}
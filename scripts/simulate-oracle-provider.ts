#!/usr/bin/env tsx

import { Cl } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const oracle1 = accounts.get("wallet_1")!;
const oracle2 = accounts.get("wallet_2")!;

console.log("🔮 Oracle Provider Simulation Starting...");

// Simulate different types of oracle providers
const oracleProviders = [
  {
    address: oracle1,
    name: "PriceOracle",
    dataTypes: ["price", "volume", "market-cap"],
    reliability: 95
  },
  {
    address: oracle2,
    name: "WeatherOracle", 
    dataTypes: ["temperature", "humidity", "precipitation"],
    reliability: 88
  }
];

// Register oracle providers
console.log("\n📝 Registering Oracle Providers...");
for (let i = 0; i < oracleProviders.length; i++) {
  const provider = oracleProviders[i];
  
  const registerResult = simnet.callPublicFn(
    "predinex-pool",
    "register-oracle-provider",
    [
      Cl.principal(provider.address),
      Cl.list(provider.dataTypes.map(dt => Cl.stringAscii(dt)))
    ],
    deployer
  );

  if (registerResult.result.type === "ok") {
    console.log(`✅ ${provider.name} registered with ID: ${registerResult.result.value.value}`);
  } else {
    console.log(`❌ Failed to register ${provider.name}`);
  }
}

// Create test pools for different scenarios
console.log("\n🏊 Creating Test Pools...");

const testPools = [
  {
    title: "Bitcoin Price Prediction",
    description: "Will Bitcoin reach $100k by end of year?",
    outcomeA: "Above $100k",
    outcomeB: "Below $100k",
    duration: 1000,
    oracleType: "price"
  },
  {
    title: "Weather Forecast",
    description: "Will it rain tomorrow in NYC?",
    outcomeA: "Rain",
    outcomeB: "No Rain", 
    duration: 500,
    oracleType: "precipitation"
  }
];

const poolIds: number[] = [];

for (let i = 0; i < testPools.length; i++) {
  const pool = testPools[i];
  
  const poolResult = simnet.callPublicFn(
    "predinex-pool",
    "create-pool",
    [
      Cl.stringAscii(pool.title),
      Cl.stringAscii(pool.description),
      Cl.stringAscii(pool.outcomeA),
      Cl.stringAscii(pool.outcomeB),
      Cl.uint(pool.duration)
    ],
    deployer
  );

  if (poolResult.result.type === "ok") {
    const poolId = Number(poolResult.result.value.value);
    poolIds.push(poolId);
    console.log(`✅ Pool "${pool.title}" created with ID: ${poolId}`);
  }
}

// Configure automated resolution for pools
console.log("\n⚙️ Configuring Automated Resolution...");

for (let i = 0; i < poolIds.length; i++) {
  const poolId = poolIds[i];
  const pool = testPools[i];
  
  // Find appropriate oracle provider
  const oracleId = pool.oracleType === "price" ? 0 : 1;
  
  const configResult = simnet.callPublicFn(
    "predinex-pool",
    "configure-pool-resolution",
    [
      Cl.uint(poolId),
      Cl.list([Cl.uint(oracleId)]),
      Cl.stringAscii(`${pool.oracleType} threshold check`),
      Cl.stringAscii("threshold"),
      Cl.some(Cl.uint(50)),
      Cl.stringAscii("AND"),
      Cl.uint(3)
    ],
    deployer
  );

  if (configResult.result.type === "ok") {
    console.log(`✅ Pool ${poolId} configured for automated resolution`);
  }
}

// Simulate oracle data submissions
console.log("\n📊 Simulating Oracle Data Submissions...");

const oracleDataSubmissions = [
  {
    poolId: 0,
    oracleAddress: oracle1,
    dataValue: "95000.50",
    dataType: "price",
    confidence: 95
  },
  {
    poolId: 0,
    oracleAddress: oracle1,
    dataValue: "94500.25", 
    dataType: "price",
    confidence: 92
  },
  {
    poolId: 1,
    oracleAddress: oracle2,
    dataValue: "15.5",
    dataType: "precipitation",
    confidence: 88
  }
];

for (const submission of oracleDataSubmissions) {
  const submitResult = simnet.callPublicFn(
    "predinex-pool",
    "submit-oracle-data",
    [
      Cl.uint(submission.poolId),
      Cl.stringAscii(submission.dataValue),
      Cl.stringAscii(submission.dataType),
      Cl.uint(submission.confidence)
    ],
    submission.oracleAddress
  );

  if (submitResult.result.type === "ok") {
    console.log(`✅ Oracle data submitted: ${submission.dataValue} (${submission.dataType}) with ${submission.confidence}% confidence`);
  }
}

// Simulate some betting activity
console.log("\n🎲 Simulating Betting Activity...");

const bets = [
  { poolId: 0, outcome: 0, amount: 500000, bettor: oracle1 },
  { poolId: 0, outcome: 1, amount: 300000, bettor: oracle2 },
  { poolId: 1, outcome: 0, amount: 200000, bettor: oracle1 }
];

for (const bet of bets) {
  const betResult = simnet.callPublicFn(
    "predinex-pool",
    "place-bet",
    [Cl.uint(bet.poolId), Cl.uint(bet.outcome), Cl.uint(bet.amount)],
    bet.bettor
  );

  if (betResult.result.type === "ok") {
    console.log(`✅ Bet placed: ${bet.amount} microSTX on outcome ${bet.outcome} for pool ${bet.poolId}`);
  }
}

// Query system state
console.log("\n📋 Querying System State...");

// Check oracle provider count
const providerCount = simnet.callReadOnlyFn(
  "predinex-pool",
  "get-oracle-provider-count",
  [],
  deployer
);
console.log(`📊 Total Oracle Providers: ${providerCount.result.value}`);

// Check oracle submissions count
const submissionCount = simnet.callReadOnlyFn(
  "predinex-pool",
  "get-oracle-submission-count",
  [],
  deployer
);
console.log(`📊 Total Oracle Submissions: ${submissionCount.result.value}`);

// Check pool count
const poolCount = simnet.callReadOnlyFn(
  "predinex-pool",
  "get-pool-count",
  [],
  deployer
);
console.log(`📊 Total Pools: ${poolCount.result.value}`);

// Check if pools are configured for automation
for (const poolId of poolIds) {
  const isAutomated = simnet.callReadOnlyFn(
    "predinex-pool",
    "is-pool-automated",
    [Cl.uint(poolId)],
    deployer
  );
  console.log(`📊 Pool ${poolId} automated: ${isAutomated.result.value}`);
}

console.log("\n🎯 Oracle Provider Simulation Complete!");
console.log("\n📈 Summary:");
console.log(`- ${oracleProviders.length} Oracle Providers Registered`);
console.log(`- ${testPools.length} Test Pools Created`);
console.log(`- ${oracleDataSubmissions.length} Oracle Data Submissions`);
console.log(`- ${bets.length} Bets Placed`);
console.log(`- All pools configured for automated resolution`);
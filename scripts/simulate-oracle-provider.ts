#!/usr/bin/env tsx

import { Cl } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

async function runSimulation() {
  const simnet = await initSimnet();
  const accounts = simnet.getAccounts();
  const deployer = accounts.get("deployer")!;
  const oracle1 = accounts.get("wallet_1")!;
  const oracle2 = accounts.get("wallet_2")!;

  console.log("🔮 Oracle Provider Simulation Starting...");

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

  await registerOracles(oracleProviders, deployer, simnet);
  const poolIds = await createTestPools(testPools, deployer, simnet);

  console.log("\n🎯 Oracle Provider Simulation Complete!");
}

async function registerOracles(providers: any[], deployer: any, simnet: any) {
  console.log("\n📝 Registering Oracle Providers...");
  for (const provider of providers) {
    const registerResult = simnet.callPublicFn(
      "predinex-pool",
      "register-oracle-provider",
      [
        Cl.principal(provider.address),
        Cl.list(provider.dataTypes.map((dt: string) => Cl.stringAscii(dt)))
      ],
      deployer
    );

    if (registerResult.result.type === "ok") {
      console.log(`✅ ${provider.name} registered with ID: ${registerResult.result.value.value}`);
    } else {
      console.log(`❌ Failed to register ${provider.name}`);
    }
  }
}

async function createTestPools(pools: any[], deployer: any, simnet: any) {
  console.log("\n🏊 Creating Test Pools...");
  const poolIds: number[] = [];
  for (const pool of pools) {
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
  return poolIds;
}

runSimulation().catch(console.error);
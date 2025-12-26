#!/usr/bin/env tsx

/**
 * API Integration Example for Automated Market Resolution System
 * 
 * This script demonstrates how to integrate with external APIs to provide
 * oracle data for automated market resolution.
 */

import { Cl } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const oracle = accounts.get("wallet_1")!;

console.log("🌐 API Integration Example for Oracle System");

// Mock API responses (in real implementation, these would be actual API calls)
const mockAPIs = {
  // CoinGecko-style price API
  async getBitcoinPrice(): Promise<{ price: number; confidence: number }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock price data
    const price = 95000 + Math.random() * 10000; // $95k-$105k range
    const confidence = 90 + Math.random() * 10; // 90-100% confidence
    
    return { price: Math.round(price * 100) / 100, confidence: Math.round(confidence) };
  },

  // Weather API (OpenWeatherMap-style)
  async getWeatherData(city: string): Promise<{ precipitation: number; temperature: number; confidence: number }> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const precipitation = Math.random() * 10; // 0-10mm
    const temperature = 15 + Math.random() * 20; // 15-35°C
    const confidence = 85 + Math.random() * 15; // 85-100% confidence
    
    return {
      precipitation: Math.round(precipitation * 10) / 10,
      temperature: Math.round(temperature * 10) / 10,
      confidence: Math.round(confidence)
    };
  },

  // Sports API (ESPN-style)
  async getSportsResult(gameId: string): Promise<{ teamAScore: number; teamBScore: number; confidence: number }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const teamAScore = Math.floor(Math.random() * 5);
    const teamBScore = Math.floor(Math.random() * 5);
    const confidence = 95 + Math.random() * 5; // 95-100% confidence for sports
    
    return { teamAScore, teamBScore, confidence: Math.round(confidence) };
  }
};

// Oracle data submission helper
async function submitOracleData(poolId: number, dataValue: string, dataType: string, confidence: number) {
  const result = simnet.callPublicFn(
    "predinex-pool",
    "submit-oracle-data",
    [
      Cl.uint(poolId),
      Cl.stringAscii(dataValue),
      Cl.stringAscii(dataType),
      Cl.uint(confidence)
    ],
    oracle
  );

  if (result.result.type === "ok") {
    console.log(`✅ Oracle data submitted: ${dataValue} (${dataType}) with ${confidence}% confidence`);
    return Number(result.result.value.value);
  } else {
    console.log(`❌ Failed to submit oracle data: ${result.result.value}`);
    return null;
  }
}

// Price Oracle Implementation
class PriceOracle {
  private oracleId: number;
  private supportedPairs: string[];

  constructor(oracleId: number, supportedPairs: string[]) {
    this.oracleId = oracleId;
    this.supportedPairs = supportedPairs;
  }

  async fetchAndSubmitPrice(poolId: number, pair: string = "BTC-USD") {
    console.log(`\n💰 Price Oracle fetching ${pair} data...`);
    
    try {
      const { price, confidence } = await mockAPIs.getBitcoinPrice();
      console.log(`📊 Fetched price: $${price.toLocaleString()} with ${confidence}% confidence`);
      
      const submissionId = await submitOracleData(
        poolId,
        price.toString(),
        "price",
        confidence
      );
      
      return { submissionId, price, confidence };
    } catch (error) {
      console.error(`❌ Price oracle error:`, error);
      return null;
    }
  }
}

// Weather Oracle Implementation
class WeatherOracle {
  private oracleId: number;
  private supportedCities: string[];

  constructor(oracleId: number, supportedCities: string[]) {
    this.oracleId = oracleId;
    this.supportedCities = supportedCities;
  }

  async fetchAndSubmitWeather(poolId: number, city: string = "NYC") {
    console.log(`\n🌤️ Weather Oracle fetching ${city} data...`);
    
    try {
      const { precipitation, temperature, confidence } = await mockAPIs.getWeatherData(city);
      console.log(`🌧️ Precipitation: ${precipitation}mm, Temperature: ${temperature}°C (${confidence}% confidence)`);
      
      // Submit precipitation data
      const precipitationSubmission = await submitOracleData(
        poolId,
        precipitation.toString(),
        "precipitation",
        confidence
      );
      
      // Submit temperature data
      const temperatureSubmission = await submitOracleData(
        poolId,
        temperature.toString(),
        "temperature",
        confidence
      );
      
      return {
        precipitationSubmission,
        temperatureSubmission,
        precipitation,
        temperature,
        confidence
      };
    } catch (error) {
      console.error(`❌ Weather oracle error:`, error);
      return null;
    }
  }
}

// Sports Oracle Implementation
class SportsOracle {
  private oracleId: number;
  private supportedSports: string[];

  constructor(oracleId: number, supportedSports: string[]) {
    this.oracleId = oracleId;
    this.supportedSports = supportedSports;
  }

  async fetchAndSubmitSportsResult(poolId: number, gameId: string = "game-123") {
    console.log(`\n⚽ Sports Oracle fetching game ${gameId} result...`);
    
    try {
      const { teamAScore, teamBScore, confidence } = await mockAPIs.getSportsResult(gameId);
      console.log(`🏆 Final Score: Team A ${teamAScore} - ${teamBScore} Team B (${confidence}% confidence)`);
      
      // Determine winner and submit result
      const winner = teamAScore > teamBScore ? "A" : teamBScore > teamAScore ? "B" : "TIE";
      const resultData = `${teamAScore}-${teamBScore}-${winner}`;
      
      const submissionId = await submitOracleData(
        poolId,
        resultData,
        "sports",
        confidence
      );
      
      return { submissionId, teamAScore, teamBScore, winner, confidence };
    } catch (error) {
      console.error(`❌ Sports oracle error:`, error);
      return null;
    }
  }
}

// Main integration demonstration
async function demonstrateAPIIntegration() {
  console.log("\n🚀 Starting API Integration Demonstration...");

  // Step 1: Register oracle providers
  console.log("\n1️⃣ Registering Oracle Providers...");
  
  const registerResult = simnet.callPublicFn(
    "predinex-pool",
    "register-oracle-provider",
    [
      Cl.principal(oracle),
      Cl.list([
        Cl.stringAscii("price"),
        Cl.stringAscii("weather"),
        Cl.stringAscii("precipitation"),
        Cl.stringAscii("temperature"),
        Cl.stringAscii("sports")
      ])
    ],
    deployer
  );

  if (registerResult.result.type === "ok") {
    console.log(`✅ Multi-purpose oracle registered with ID: ${registerResult.result.value.value}`);
  }

  // Step 2: Create test pools
  console.log("\n2️⃣ Creating Test Pools...");
  
  const pools = [
    {
      title: "Bitcoin $100K Prediction",
      description: "Will Bitcoin reach $100,000?",
      outcomeA: "Yes - Above $100K",
      outcomeB: "No - Below $100K",
      type: "price"
    },
    {
      title: "NYC Weather Tomorrow",
      description: "Will it rain in NYC tomorrow?",
      outcomeA: "Rain (>0mm)",
      outcomeB: "No Rain (0mm)",
      type: "weather"
    },
    {
      title: "Championship Game",
      description: "Who will win the championship?",
      outcomeA: "Team A",
      outcomeB: "Team B",
      type: "sports"
    }
  ];

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
        Cl.uint(100) // Short duration for testing
      ],
      deployer
    );

    if (poolResult.result.type === "ok") {
      const poolId = Number(poolResult.result.value.value);
      poolIds.push(poolId);
      console.log(`✅ ${pool.type} pool created: ${pool.title} (ID: ${poolId})`);
    }
  }

  // Step 3: Initialize oracle instances
  console.log("\n3️⃣ Initializing Oracle Instances...");
  
  const priceOracle = new PriceOracle(0, ["BTC-USD", "ETH-USD"]);
  const weatherOracle = new WeatherOracle(0, ["NYC", "LA", "Chicago"]);
  const sportsOracle = new SportsOracle(0, ["NFL", "NBA", "MLB"]);

  console.log(`✅ Price Oracle initialized for BTC-USD`);
  console.log(`✅ Weather Oracle initialized for NYC`);
  console.log(`✅ Sports Oracle initialized for championship games`);

  // Step 4: Fetch and submit data from APIs
  console.log("\n4️⃣ Fetching Data from External APIs...");

  // Price data for Bitcoin pool
  if (poolIds[0]) {
    const priceData = await priceOracle.fetchAndSubmitPrice(poolIds[0]);
    if (priceData) {
      console.log(`💰 Price oracle submitted: $${priceData.price.toLocaleString()}`);
    }
  }

  // Weather data for NYC pool
  if (poolIds[1]) {
    const weatherData = await weatherOracle.fetchAndSubmitWeather(poolIds[1]);
    if (weatherData) {
      console.log(`🌧️ Weather oracle submitted: ${weatherData.precipitation}mm precipitation`);
    }
  }

  // Sports data for championship pool
  if (poolIds[2]) {
    const sportsData = await sportsOracle.fetchAndSubmitSportsResult(poolIds[2]);
    if (sportsData) {
      console.log(`⚽ Sports oracle submitted: ${sportsData.teamAScore}-${sportsData.teamBScore} (Winner: ${sportsData.winner})`);
    }
  }

  // Step 5: Configure automated resolution
  console.log("\n5️⃣ Configuring Automated Resolution...");

  for (let i = 0; i < poolIds.length; i++) {
    const poolId = poolIds[i];
    const pool = pools[i];
    
    let criteria = "";
    let criteriaType = "";
    let threshold = null;
    
    switch (pool.type) {
      case "price":
        criteria = "price >= 100000";
        criteriaType = "price";
        threshold = 100000;
        break;
      case "weather":
        criteria = "precipitation > 0";
        criteriaType = "precipitation";
        threshold = 0;
        break;
      case "sports":
        criteria = "team_a_score > team_b_score";
        criteriaType = "sports";
        break;
    }

    const configResult = simnet.callPublicFn(
      "predinex-pool",
      "configure-pool-resolution",
      [
        Cl.uint(poolId),
        Cl.list([Cl.uint(0)]), // Use oracle ID 0
        Cl.stringAscii(criteria),
        Cl.stringAscii(criteriaType),
        threshold ? Cl.some(Cl.uint(threshold)) : Cl.none(),
        Cl.stringAscii("AND"),
        Cl.uint(3)
      ],
      deployer
    );

    if (configResult.result.type === "ok") {
      console.log(`✅ Pool ${poolId} configured for automated resolution: ${criteria}`);
    }
  }

  // Step 6: Query system state
  console.log("\n6️⃣ Querying System State...");

  // Check oracle submissions
  const submissionCount = simnet.callReadOnlyFn(
    "predinex-pool",
    "get-oracle-submission-count",
    [],
    deployer
  );
  console.log(`📊 Total Oracle Submissions: ${submissionCount.result.value}`);

  // Check oracle provider details
  const oracleProvider = simnet.callReadOnlyFn(
    "predinex-pool",
    "get-oracle-provider",
    [Cl.uint(0)],
    deployer
  );
  
  if (oracleProvider.result.type === "some") {
    const provider = oracleProvider.result.value.data;
    console.log(`📊 Oracle Reliability: ${provider["reliability-score"].value}%`);
    console.log(`📊 Oracle Resolutions: ${provider["total-resolutions"].value}`);
  }

  // Check pool automation status
  for (const poolId of poolIds) {
    const isAutomated = simnet.callReadOnlyFn(
      "predinex-pool",
      "is-pool-automated",
      [Cl.uint(poolId)],
      deployer
    );
    console.log(`📊 Pool ${poolId} automated: ${isAutomated.result.value}`);
  }

  console.log("\n🎯 API Integration Demonstration Complete!");
}

// Error handling wrapper
async function runWithErrorHandling() {
  try {
    await demonstrateAPIIntegration();
  } catch (error) {
    console.error("❌ Integration demonstration failed:", error);
    process.exit(1);
  }
}

// Real-world API integration examples
console.log("\n📚 Real-World API Integration Examples:");
console.log(`
🔗 Price Oracles:
- CoinGecko: https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd
- CoinMarketCap: https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest
- Binance: https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT

🌤️ Weather Oracles:
- OpenWeatherMap: https://api.openweathermap.org/data/2.5/weather?q=NewYork&appid=API_KEY
- WeatherAPI: https://api.weatherapi.com/v1/current.json?key=API_KEY&q=NewYork
- AccuWeather: https://dataservice.accuweather.com/currentconditions/v1/LOCATION_KEY

⚽ Sports Oracles:
- ESPN: https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard
- The Sports DB: https://www.thesportsdb.com/api/v1/json/1/eventsday.php?d=2024-01-01
- SportsData.io: https://api.sportsdata.io/v3/nfl/scores/json/GamesByDate/2024-01-01
`);

// Run the demonstration
runWithErrorHandling();
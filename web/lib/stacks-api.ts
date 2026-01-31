export interface Pool {
  id: number;
  title: string;
  description: string;
  creator: string;
  outcomeA: string;
  outcomeB: string;
  totalA: number;
  totalB: number;
  expiry: number;
  settled: boolean;
  status: 'active' | 'settled' | 'expired';
}

export async function getPool(id: number): Promise<Pool | null> {
  // Mock implementation for now, replaced later with real call
  return {
    id,
    title: "Will Bitcoin hit $100k in 2024?",
    description: "Predicting the price of BTC by end of year.",
    creator: "SP123...ABC",
    outcomeA: "Yes",
    outcomeB: "No",
    totalA: 5000000,
    totalB: 3000000,
    expiry: 100000,
    settled: false,
    status: 'active'
  };
}

export async function getMarkets(filter: string): Promise<Pool[]> {
  return [
    {
       id: 1,
       title: "Will Bitcoin hit $100k in 2024?",
       description: "Predicting the price of BTC by end of year.",
       creator: "SP123...ABC",
       outcomeA: "Yes",
       outcomeB: "No",
       totalA: 5000000,
       totalB: 3000000,
       expiry: 100000,
       settled: false,
       status: 'active'
    },
    {
       id: 2,
       title: "Will Stacks Nakamoto Upgrade succeed?",
       description: "Bet heavily on the success of Nakamoto.",
       creator: "SP456...DEF",
       outcomeA: "Success",
       outcomeB: "Flop",
       totalA: 1200000,
       totalB: 100000,
       expiry: 105000,
       settled: false,
       status: 'active'
    }
  ];
}
// Types for Predinex Stacks API

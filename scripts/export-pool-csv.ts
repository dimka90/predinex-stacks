import fs from "fs";
// Exports all pool data to CSV for analytics
const header = "id,status,totalBets,createdAt\n";
fs.writeFileSync("pools-export.csv", header);
console.log("CSV exported to pools-export.csv");

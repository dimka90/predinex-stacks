import fetch from 'node-fetch';

const CONTRACT_ADDRESS = 'SP2W_EJMBN';
const CONTRACT_NAME = 'predinex-pool-1771470759824';

async function monitorEvents() {
    console.log(`📡 Monitoring events for: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}\n`);
    console.log("Press Ctrl+C to stop.\n");

    const url = `https://api.mainnet.hiro.so/extended/v1/address/${CONTRACT_ADDRESS}.${CONTRACT_NAME}/events`;

    const poll = async () => {
        try {
            const response = await fetch(url);
            const data = await response.json() as any;

            if (data.results && data.results.length > 0) {
                console.log(`🔔 Found ${data.results.length} recent events:`);
                data.results.slice(0, 5).forEach((event: any, i: number) => {
                    console.log(`   [${i + 1}] Type: ${event.event_type}`);
                    if (event.contract_log) {
                        console.log(`       Value: ${JSON.stringify(event.contract_log.value)}`);
                    }
                });
            } else {
                console.log("⏳ No new events found...");
            }
        } catch (error) {
            console.error("❌ Error polling events:", error);
        }
    };

    // Initial check
    await poll();

    // Poll every 30 seconds
    setInterval(poll, 30000);
}

monitorEvents();

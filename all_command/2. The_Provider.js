// Create a provider instance
const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");

// Fetch the latest block number from the chain
const block = await provider.getBlockNumber();

// Result is a standard JavaScript Number
console.log("Current Block:", block);
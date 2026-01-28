// 1. Define ABI in human-readable format
const abi = ["function name() view returns (string)"];

// 2. Initialize the Contract instance
const contract = new ethers.Contract(USDC_ADDR, abi, provider);

// 3. Call a read-only (view) function
const name = await contract.name();
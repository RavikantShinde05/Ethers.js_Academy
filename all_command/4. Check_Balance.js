// Fetch balance for specific address
const balance = await provider.getBalance("ADDRESS");

// Returns BigInt in Wei (not a standard number)
console.log(balance);
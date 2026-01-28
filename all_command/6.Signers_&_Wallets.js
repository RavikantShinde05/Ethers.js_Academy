// 1. Create a wallet instance from a private key
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// 2. Sign a plain text message
const sig = await wallet.signMessage("Hello World");
console.log("Signature:", sig);
// 1. Standard Node Connection (`via RPC URL`)
const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");

// 2. MetaMask / Browser Wallet Connection
const browserProvider = new ethers.BrowserProvider(window.ethereum);

// 3. Multi-backend Default Provider (Mainnet fallback)
const defaultProvider = ethers.getDefaultProvider();
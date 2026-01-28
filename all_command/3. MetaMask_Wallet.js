// 1. Initialize the browser provider using window.ethereum
const provider = new ethers.BrowserProvider(window.ethereum);

// 2. Request account access (triggers MetaMask popup)
const accounts = await provider.send("eth_requestAccounts", []);

// 3. Get the Signer to perform write operations
const signer = await provider.getSigner();
console.log("Account:", accounts[0]);
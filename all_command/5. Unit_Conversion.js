// 1. Wei BigInt to ETH string conversion
const eth = ethers.formatEther(weiBalance);

// 2. ETH string to Wei BigInt (1.0 ETH = 10^18 Wei)
const wei = ethers.parseEther("1.0");

// 3. Convert to specific units like Gwei
const gwei = ethers.formatUnits(wei, "gwei");
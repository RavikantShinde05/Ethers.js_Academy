// 1. Connect a signer to the contract
const contractWithSigner = contract.connect(wallet);

// 2. Execute a state-changing function
const tx = await contractWithSigner.transfer(to, amount);

// 3. Wait for the transaction to be mined
const receipt = await tx.wait();
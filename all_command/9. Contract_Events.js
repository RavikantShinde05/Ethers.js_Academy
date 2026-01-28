// Listen for the 'Transfer' event in real-time
contract.on("Transfer", (from, to, value, event) => {
  console.log("New Transfer Found!");
  // value is a BigInt
});
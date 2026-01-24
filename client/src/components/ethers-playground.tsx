import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { 
  Play, 
  RotateCcw, 
  Loader2, 
  CheckCircle, 
  Terminal as TerminalIcon, 
  AlertCircle,
  Database,
  Wallet,
  ArrowRightLeft,
  Settings2,
  Code2,
  FileCode2,
  Cpu,
  Key,
  Send,
  Unplug,
  ChevronRight,
  ChevronLeft,
  MousePointer2,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { toast } from "sonner";

// USDC Mainnet Address for Contract Interaction Demo
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48";
const DEMO_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // vitalik.eth
const MINI_ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

interface LogEntry {
  type: "info" | "success" | "error" | "output";
  message: string;
  timestamp: string;
}

interface Module {
  id: string;
  title: string;
  icon: any;
  description: string;
  explanation: string;
  tip: string;
  code: (rpc: string, addr: string) => string;
  action: (provider: any, rpc: string, addLog: any, addr: string) => Promise<void>;
}

const MODULES: Module[] = [
  {
    id: "connections",
    title: "1. Connection Methods",
    icon: Unplug,
    description: "Ways to connect to Ethereum",
    tip: "Pro Tip: BrowserProvider replaces the old Web3Provider from v5.",
    explanation: "Providers are your view into the Ethereum network. Think of them as read-only windows. You use a 'JsonRpcProvider' to talk to a network like Mainnet via an API, or a 'BrowserProvider' to talk to a wallet like MetaMask already installed in your browser. It's the starting point for every app.",
    code: (rpc: string) => `// 1. Standard Node Connection (via RPC URL)\nconst provider = new ethers.JsonRpcProvider("${rpc || 'YOUR_RPC_URL'}");\n\n// 2. MetaMask / Browser Wallet Connection\nconst browserProvider = new ethers.BrowserProvider(window.ethereum);\n\n// 3. Multi-backend Default Provider (Mainnet fallback)\nconst defaultProvider = ethers.getDefaultProvider();`,
    action: async (provider: any, rpc: string, addLog: any) => {
      addLog("Detecting connection methods...", "info");
      if (!rpc) {
        addLog("Warning: No RPC URL provided. Use a provider like Alchemy or Infura.", "error");
      } else {
        addLog(`JSON-RPC: Configured for ${rpc.substring(0, 20)}...`, "output");
      }
      if (typeof window !== "undefined" && (window as any).ethereum) {
        addLog("Browser Wallet: MetaMask/Rabby detected and ready.", "success");
      }
      addLog("Default Provider: Initialized with fallback nodes.", "output");
    }
  },
  {
    id: "provider",
    title: "2. The Provider",
    icon: Database,
    description: "Read-only network interaction",
    tip: "Note: getBlockNumber returns a promise that resolves to a number.",
    explanation: "The Provider is your main tool for asking the blockchain questions. Since reading data is free, you don't need a wallet or gas. 'getBlockNumber()' is the simplest way to check if your connection is working by seeing the latest block created on the network.",
    code: (rpc: string) => `// Create a provider instance\nconst provider = new ethers.JsonRpcProvider("${rpc || 'YOUR_RPC_URL'}");\n\n// Fetch the latest block number from the chain\nconst block = await provider.getBlockNumber();\n\n// Result is a standard JavaScript Number\nconsole.log("Current Block:", block);`,
    action: async (provider: any, rpc: string, addLog: any) => {
      if (!rpc) throw new Error("Please enter an RPC URL first.");
      addLog("Querying network for latest block...", "info");
      const block = await provider.getBlockNumber();
      addLog(`Block Number: ${block}`, "output");
    }
  },
  {
    id: "metamask",
    title: "3. MetaMask Wallet",
    icon: MousePointer2,
    description: "Connect Your Own Wallet",
    tip: "Safety: Never share your private key or seed phrase with any website.",
    explanation: "To build apps where users can actually *do* things, you need to connect their wallet. Using 'BrowserProvider', you can ask MetaMask to show a popup. Once the user clicks 'Connect', your app can see their address and ask them to sign transactions later.",
    code: () => `// 1. Initialize the browser provider using window.ethereum\nconst provider = new ethers.BrowserProvider(window.ethereum);\n\n// 2. Request account access (triggers MetaMask popup)\nconst accounts = await provider.send("eth_requestAccounts", []);\n\n// 3. Get the Signer to perform write operations\nconst signer = await provider.getSigner();\nconsole.log("Account:", accounts[0]);`,
    action: async (provider: any, rpc: string, addLog: any) => {
      if (typeof window === "undefined" || !(window as any).ethereum) {
        throw new Error("No browser wallet detected. Please install MetaMask.");
      }
      addLog("Requesting MetaMask accounts...", "info");
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      addLog(`Connected Account: ${accounts[0]}`, "success");
      const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
      const network = await browserProvider.getNetwork();
      addLog(`Connected to Chain ID: ${network.chainId}`, "output");
    }
  },
  {
    id: "balance",
    title: "4. Check Balance",
    icon: Wallet,
    description: "Reading Account State",
    tip: "BigInt: Remember that 1 ETH = 10^18 Wei.",
    explanation: "Checking a balance is a simple read operation. However, Ethereum handles numbers in 'Wei' (a tiny unit). Because these numbers are huge, we use 'BigInt' in JavaScript so we don't lose precision. 1 ETH is actually 1,000,000,000,000,000,000 Wei!",
    code: (rpc: string, addr: string) => `// Fetch balance for specific address\nconst balance = await provider.getBalance("${addr || 'ADDRESS'}");\n\n// Returns BigInt in Wei (not a standard number)\nconsole.log(balance);`,
    action: async (provider: any, rpc: string, addLog: any, addr: string) => {
      if (!addr) throw new Error("Please enter a Target Address first.");
      addLog(`Reading balance for ${addr.substring(0, 10)}...`, "info");
      const balance = await provider.getBalance(addr);
      addLog(`Raw Balance (Wei): ${balance.toString()}`, "output");
    }
  },
  {
    id: "format",
    title: "5. Unit Conversion",
    icon: ArrowRightLeft,
    description: "Wei ↔ Ether ↔ Gwei",
    tip: "Formatting: parseEther returns a BigInt, formatEther returns a string.",
    explanation: "Since nobody wants to read 18-digit numbers, Ethers provides tools to convert them. 'formatEther' turns huge numbers into human-readable strings (like '1.5 ETH'). 'parseEther' does the opposite, turning a string into the big number the blockchain understands.",
    code: (rpc: string, addr: string) => `// 1. Wei BigInt to ETH string conversion\nconst eth = ethers.formatEther(weiBalance);\n\n// 2. ETH string to Wei BigInt (1.0 ETH = 10^18 Wei)\nconst wei = ethers.parseEther("1.0");\n\n// 3. Convert to specific units like Gwei\nconst gwei = ethers.formatUnits(wei, "gwei");`,
    action: async (provider: any, rpc: string, addLog: any, addr: string) => {
      const balance = addr ? await provider.getBalance(addr) : ethers.parseEther("1.0");
      const eth = ethers.formatEther(balance);
      const gwei = ethers.formatUnits(balance, "gwei");
      addLog(`Formatted: ${eth} ETH`, "output");
      addLog(`Converted: ${gwei} gwei`, "output");
      addLog(`Parsed: ${balance.toString()} wei`, "output");
    }
  },
  {
    id: "wallet",
    title: "6. Signers & Wallets",
    icon: Key,
    description: "Managing Keys & Signing",
    tip: "Wallet: Signers are needed for any operation that changes blockchain state.",
    explanation: "A 'Signer' is like a Provider but with a pen. While a Provider can only read, a Signer can authorize actions using a private key. In your app, the 'Wallet' class represents a specific account that can sign messages and spend funds.",
    code: () => `// 1. Create a wallet instance from a private key\nconst wallet = new ethers.Wallet(PRIVATE_KEY, provider);\n\n// 2. Sign a plain text message\nconst sig = await wallet.signMessage("Hello World");\nconsole.log("Signature:", sig);`,
    action: async (provider: any, rpc: string, addLog: any) => {
      addLog("Generating disposable educational wallet...", "info");
      const wallet = ethers.Wallet.createRandom();
      addLog(`Address: ${wallet.address}`, "output");
      addLog("Signing message: 'Ethers v6 Learn'...", "info");
      const sig = await wallet.signMessage("Ethers v6 Learn");
      addLog(`Signature: ${sig.substring(0, 30)}...`, "output");
    }
  },
  {
    id: "read-contract",
    title: "7. Read Contract",
    icon: FileCode2,
    description: "Calling 'view' functions",
    tip: "ABI: Human-Readable ABI is a feature unique to Ethers.js.",
    explanation: "To talk to a smart contract, you need two things: its address and a list of its functions (the ABI). Ethers makes this easy with 'Human-Readable ABI'—you just write the function names like normal JavaScript to start querying the contract.",
    code: () => `// 1. Define ABI in human-readable format\nconst abi = ["function name() view returns (string)"];\n\n// 2. Initialize the Contract instance\nconst contract = new ethers.Contract(USDC_ADDR, abi, provider);\n\n// 3. Call a read-only (view) function\nconst name = await contract.name();`,
    action: async (provider: any, rpc: string, addLog: any) => {
      addLog("Connecting to USDC Smart Contract...", "info");
      const contract = new ethers.Contract(USDC_ADDRESS, MINI_ERC20_ABI, provider);
      const name = await contract.name();
      const symbol = await contract.symbol();
      addLog(`Contract: ${name} (${symbol})`, "output");
    }
  },
  {
    id: "write-contract",
    title: "8. Write Contract",
    icon: Send,
    description: "Sending Transactions",
    tip: "Mining: Always 'wait()' for transactions to ensure they were included in a block.",
    explanation: "Changing data on the blockchain (like sending tokens) costs gas and takes time. You connect a Signer to the Contract, call the function, and then—critically—you must 'wait()' for the network to finish mining your transaction before proceeding.",
    code: () => `// 1. Connect a signer to the contract\nconst contractWithSigner = contract.connect(wallet);\n\n// 2. Execute a state-changing function\nconst tx = await contractWithSigner.transfer(to, amount);\n\n// 3. Wait for the transaction to be mined\nconst receipt = await tx.wait();`,
    action: async (provider: any, rpc: string, addLog: any) => {
      addLog("Pattern: contract.connect(signer).method(args)", "info");
      addLog("Step 1: Send Transaction (User must approve in wallet)", "output");
      addLog("Step 2: Await Mining (Wait for receipt)", "output");
      addLog("Simulation complete.", "success");
    }
  },
  {
    id: "events",
    title: "9. Contract Events",
    icon: Code2,
    description: "Blockchain Webhooks",
    tip: "Events: Useful for updating your UI without constant polling.",
    explanation: "Smart contracts can shout out updates using 'Events'. Instead of constantly asking the network if something changed, your app can just 'listen' for an event like a transfer. When it happens, your code runs automatically—just like a notification.",
    code: () => `// Listen for the 'Transfer' event in real-time\ncontract.on("Transfer", (from, to, value, event) => {\n  console.log("New Transfer Found!");\n  // value is a BigInt\n});`,
    action: async (provider: any, rpc: string, addLog: any) => {
      addLog("Initializing Event Listener...", "info");
      addLog("Monitoring 'Transfer' events on-chain...", "output");
      addLog("Logic: contract.on('EventName', handler)", "output");
      addLog("Listener Active (Simulation).", "success");
    }
  },
  {
    id: "utils",
    title: "10. Advanced Utils",
    icon: Settings2,
    description: "Hashing & Encoding",
    tip: "v6 Change: Many utilities moved from ethers.utils to top-level or sub-packages.",
    explanation: "Ethers includes a Swiss Army Knife of tools for complex tasks. This includes 'id' for creating unique digital fingerprints (hashes) of text, and 'getAddress' to make sure an Ethereum address is valid and formatted correctly.",
    code: () => `// 1. Generate Keccak256 hash of a string\nconst hash = ethers.id("ethers-v6");\n\n// 2. Validate and checksum an Ethereum address\nconst checksum = ethers.getAddress("0x...");`,
    action: async (provider: any, rpc: string, addLog: any) => {
      const hash = ethers.id("Ethers.js v6.16.0");
      addLog(`Hash of 'Ethers.js v6.16.0': ${hash}`, "output");
      const checksum = ethers.getAddress(DEMO_ADDRESS);
      addLog(`Address Checksum: ${checksum}`, "output");
    }
  }
];

export default function EthersPlayground() {
  const [location, setLocation] = useLocation();
  const [providerUrl, setProviderUrl] = useState("");
  const [targetAddress, setTargetAddress] = useState("");
  const [userInput, setUserInput] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentModuleId = location.split("/").pop() || "connections";
  const currentModuleIndex = MODULES.findIndex(m => m.id === currentModuleId);
  const currentModule = MODULES[currentModuleIndex] || MODULES[0];

  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [
      ...prev,
      { message, type, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const runDemo = async () => {
    setIsLoading(true);
    setLogs([]);
    try {
      let provider;
      const eth = (window as any).ethereum;

      // Logic to pick the best provider
      if (providerUrl) {
        addLog(`Using Custom RPC: ${providerUrl.substring(0, 20)}...`, "info");
        provider = new ethers.JsonRpcProvider(providerUrl);
      } else if (eth && targetAddress) {
        addLog("Using Connected Browser Wallet (MetaMask)...", "info");
        provider = new ethers.BrowserProvider(eth);
      } else {
        addLog("Using Ethers Default Provider (Mainnet)...", "info");
        provider = ethers.getDefaultProvider();
      }

      await currentModule.action(provider, providerUrl, addLog, targetAddress);
    } catch (error) {
      console.error(error);
      addLog(`Execution Error: ${(error as Error).message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const checkCodeMatch = () => {
    const cleanInput = userInput.trim().replace(/\s/g, '');
    const cleanCode = currentModule.code(providerUrl, targetAddress).trim().replace(/\s/g, '');
    if (cleanInput.length > 15 && cleanCode.includes(cleanInput)) {
       toast.success("Correct! Your syntax is spot on.", { duration: 2000, icon: <Sparkles className="w-4 h-4 text-yellow-500" /> });
    }
  };

  const nextModule = () => {
    const next = MODULES[currentModuleIndex + 1];
    if (next) setLocation(`/learn/${next.id}`);
    setUserInput("");
  };

  const prevModule = () => {
    const prev = MODULES[currentModuleIndex - 1];
    if (prev) setLocation(`/learn/${prev.id}`);
    setUserInput("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Session Controls - Enhanced Connect MetaMask */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl border-t border-l border-white/20">
        <CardContent className="pt-8 pb-6">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 grid md:grid-cols-2 gap-4 w-full">
               <div className="space-y-2 relative">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    Network Gateway
                    {providerUrl && <CheckCircle className="w-3 h-3 text-white" />}
                  </label>
                  <Input 
                    placeholder="Enter Infura/Alchemy RPC URL..."
                    value={providerUrl} 
                    onChange={(e) => setProviderUrl(e.target.value)}
                    className="h-12 bg-white/5 font-mono text-sm border-white/10 focus:border-white/30 text-white placeholder:text-gray-600"
                  />
               </div>
               <div className="space-y-2 relative">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    Focus Address
                    {targetAddress && <CheckCircle className="w-3 h-3 text-white" />}
                  </label>
                  <Input 
                    placeholder="Enter wallet address (0x...)"
                    value={targetAddress} 
                    onChange={(e) => setTargetAddress(e.target.value)}
                    className="h-12 bg-white/5 font-mono text-sm border-white/10 focus:border-white/30 text-white placeholder:text-gray-600"
                  />
               </div>
            </div>
            
            <Button 
              className="w-full md:w-auto h-12 px-8 font-bold text-base transition-all active:scale-95 shadow-lg bg-white text-black hover:bg-gray-200"
              onClick={async () => {
                const eth = (window as any).ethereum;
                if (typeof window !== "undefined" && eth) {
                   try {
                     addLog("Requesting account access via MetaMask...", "info");
                     // Standard request to trigger MetaMask popup
                     const accounts = await eth.request({ method: "eth_requestAccounts" });
                     
                     if (accounts && accounts.length > 0) {
                       setTargetAddress(accounts[0]);
                       toast.success("Wallet Connected", { 
                         description: `Address: ${accounts[0].substring(0, 6)}...`,
                         icon: <Wallet className="w-4 h-4" /> 
                       });
                       addLog(`Connection Success: ${accounts[0]}`, "success");
                       
                       const provider = new ethers.BrowserProvider(eth);
                       const network = await provider.getNetwork();
                       addLog(`Chain ID: ${network.chainId}`, "output");
                     } else {
                       addLog("No accounts returned from MetaMask.", "error");
                     }
                   } catch (err: any) {
                     console.error("MetaMask Error:", err);
                     addLog(`Request failed: ${err.message} (Code: ${err.code})`, "error");
                     
                     if (err.code === 4001) {
                       toast.error("User rejected connection");
                     } else if (err.code === -32002) {
                       toast.warning("Request pending", { description: "Check your MetaMask notification" });
                     } else {
                       toast.error("Connection error", { description: err.message });
                     }
                   }
                } else {
                  toast.error("MetaMask not found", { description: "Please install the extension" });
                  addLog("Critical: window.ethereum is undefined", "error");
                }
              }}
            >
              <MousePointer2 className="w-5 h-5 mr-2" /> Connect MetaMask
            </Button>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground">
             <ShieldCheck className="w-3 h-3" />
             <span>Strictly non-custodial. Your keys never leave your device. Session clears on refresh.</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Module Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                 <currentModule.icon className="w-7 h-7" />
               </div>
               <div>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-primary tracking-widest uppercase px-2 py-0.5 bg-primary/10 rounded-full">Step {currentModuleIndex + 1}</span>
                    <h2 className="text-2xl font-display font-bold text-white tracking-tight">{currentModule.title.split('. ')[1]}</h2>
                 </div>
                 <p className="text-sm text-muted-foreground">{currentModule.description}</p>
               </div>
             </div>
             <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={prevModule} disabled={currentModuleIndex === 0} className="border-white/10 hover:bg-white/5 rounded-xl h-10 w-10">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextModule} disabled={currentModuleIndex === MODULES.length - 1} className="border-white/10 hover:bg-white/5 rounded-xl h-10 w-10">
                  <ChevronRight className="w-5 h-5" />
                </Button>
             </div>
          </div>

          <div className="space-y-4">
             {/* Concept Section Moved Above */}
             <motion.div 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               className="grid gap-4"
             >
               <Card className="border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden border-l-4 border-l-white/40 shadow-2xl">
                 <CardHeader className="bg-white/5 py-3 flex flex-row items-center gap-3">
                   <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 shadow-inner">
                     <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                   </div>
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Core Architecture</span>
                </CardHeader>
                <CardContent className="pt-5 pb-6 leading-relaxed text-[15px] text-gray-100 font-sans tracking-tight antialiased selection:bg-white/20">
                  <p className="opacity-100 leading-7 border-l-2 border-white/20 pl-5 py-1 font-medium">
                     {currentModule.explanation}
                   </p>
                 </CardContent>
               </Card>
             </motion.div>

             <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5" /> Interactive Sandbox
                </span>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setUserInput(currentModule.code(providerUrl, targetAddress))} 
                    variant="secondary" 
                    className="h-8 text-xs font-bold px-4 shadow-sm bg-white/10 text-white hover:bg-white/20 border border-white/5"
                  >
                    Copy Solution
                  </Button>
                  <Button 
                    onClick={runDemo} 
                    disabled={isLoading} 
                    className="bg-white text-black hover:bg-gray-200 shadow-xl h-8 text-xs font-bold px-4"
                  >
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Play className="w-3 h-3 mr-2" />}
                    Run Script
                  </Button>
                </div>
             </div>
             
             <div className="grid gap-4">
                <div className="rounded-2xl border border-white/5 bg-black/60 p-8 font-mono text-sm relative group overflow-hidden backdrop-blur-sm">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="absolute top-4 right-6 text-[10px] font-bold text-white/20 select-none uppercase tracking-widest italic">Reference Snippet</div>
                  <pre className="text-gray-300 leading-relaxed font-semibold">
                    <code>{currentModule.code(providerUrl, targetAddress)}</code>
                  </pre>
                </div>
                
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-white/10 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
                  <textarea 
                    value={userInput}
                    onChange={(e) => {
                      setUserInput(e.target.value);
                      checkCodeMatch();
                    }}
                    placeholder="// Type the code above to practice..."
                    className="relative w-full h-56 bg-white/[0.03] border border-white/10 rounded-2xl p-8 font-mono text-base focus:border-white/30 focus:outline-none resize-none transition-all placeholder:text-gray-600 shadow-2xl text-white"
                  />
                  <div className="absolute bottom-6 right-8 flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest">
                    <span className={`transition-colors ${userInput.length > 0 ? 'text-white' : 'text-gray-600'}`}>
                      {userInput.length} chars
                    </span>
                    <span className="text-white/10">|</span>
                    <span className="text-gray-500 animate-pulse">Awaiting Input</span>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Persistent Console */}
        <div className="lg:col-span-4 h-full flex flex-col min-h-[500px]">
          <Card className="border-white/10 bg-black/60 flex-1 flex flex-col shadow-2xl backdrop-blur-xl">
            <CardHeader className="border-b border-white/10 py-4 px-6 bg-white/[0.02]">
               <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold font-mono uppercase tracking-widest flex items-center gap-2 transition-colors duration-300 ${isLoading ? 'text-green-400' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-colors duration-300 ${isLoading ? 'bg-green-400 animate-pulse' : 'bg-white'}`} /> 
                    Console
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setLogs([])} className="h-6 text-[10px] font-bold uppercase tracking-wider px-3 shadow-sm bg-white/5 hover:bg-white/10 border-white/10 text-gray-400 hover:text-white transition-all">
                    CLEAR
                  </Button>
               </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full max-h-[700px] p-6 font-mono text-[11px] leading-relaxed">
                <AnimatePresence mode="popLayout">
                  {logs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-10 py-48 text-center grayscale">
                      <TerminalIcon className="w-10 h-10 mb-4" />
                      <p className="uppercase tracking-tighter">System Idle</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {logs.map((log, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 pb-2 border-b border-white/[0.02] last:border-0 ${
                            log.type === 'error' ? 'text-red-400' : 
                            log.type === 'success' ? 'text-white' : 
                            log.type === 'output' ? 'text-gray-300' : 'text-gray-500'
                          }`}
                        >
                          <span className="opacity-20 flex-shrink-0 font-bold select-none">{log.timestamp.split(' ')[0]}</span>
                          <p className="flex-1 break-all leading-normal">{log.message}</p>
                        </motion.div>
                      ))}
                      <div className="h-4" />
                    </div>
                  )}
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

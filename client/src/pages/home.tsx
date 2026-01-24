import Layout from "@/components/layout";
import EthersPlayground from "@/components/ethers-playground";
import { Badge } from "@/components/ui/badge";
import { Github, Star, ExternalLink, Cpu, ShieldCheck, Zap, Linkedin } from "lucide-react";
import bgImage from "@assets/generated_images/abstract_digital_blockchain_network_dark_background.png";

export default function Home() {
  return (
    <Layout>
      {/* Background Image Override */}
      <div 
        className="fixed inset-0 z-[-2] opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="space-y-8 max-w-7xl mx-auto pb-20">
        <div className="space-y-4">
          <Badge className="bg-white/10 text-white border-white/20 hover:bg-white/20 px-3 py-1 text-xs font-bold tracking-tight shadow-sm backdrop-blur-md">
            v6.16.0 Ready
          </Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight">
            Mastering <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 text-glow">Ethers.js</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl font-light leading-relaxed">
            The ultimate interactive playground for modern blockchain development. 
            Learn Ethers.js by doing, with real-time feedback and direct MetaMask integration.
          </p>
        </div>

        <EthersPlayground />
        
        <div className="grid md:grid-cols-3 gap-6 pt-12">
            <FeatureCard 
              icon={<Zap className="w-5 h-5" />}
              title="Progressive Learning"
              description="A structured curriculum taking you from provider basics to advanced contract events."
            />
             <FeatureCard 
              icon={<ShieldCheck className="w-5 h-5" />}
              title="Privacy First"
              description="No data is stored on our servers. All API keys and session data are cleared on refresh."
            />
             <FeatureCard 
              icon={<Cpu className="w-5 h-5" />}
              title="Real-Time Sandbox"
              description="Test your code against live mainnet data and see immediate logs in the debug console."
            />
        </div>

        {/* GitHub Demo Footer */}
        <footer className="mt-24 pt-12 border-t border-white/5">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-display font-bold text-white mb-4">Project Overview</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                This project was built to solve the steep learning curve of Web3 development. 
                By providing an interactive, code-along experience, developers can visualize 
                how Ethers.js interacts with the Ethereum Virtual Machine (EVM) in real-time.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://github.com/RavikantShinde05/Ethers.js_Academy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-white/90 transition-all shadow-xl"
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </a>
                <a 
                  href="https://linkedin.com/in/shinderavikantss05" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all shadow-xl"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </a>
                <a 
                  href="https://docs.ethers.org/v6/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                  Ethers.js Docs
                </a>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Star className="w-24 h-24 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" /> Open Source
              </h4>
              <p className="text-sm text-muted-foreground mb-6">
                Loved this playground? Feel free to fork it, contribute, or use it as a base for your own Web3 education platform.
              </p>
              <div className="flex gap-4 text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> React 19</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Tailwind v4</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Ethers v6</span>
              </div>
            </div>
          </div>
          
          <div className="mt-20 text-center border-t border-white/5 pt-8 text-xs text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2026 Ethers.js Academy. Built for the community.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all hover:translate-y-[-2px] group shadow-2xl">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <h3 className="font-display font-bold text-lg mb-2 text-white">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
import { Link } from "wouter";
import { Terminal, Book, Box } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground bg-grid-pattern relative overflow-hidden font-sans selection:bg-primary/20 selection:text-primary">
      {/* Navbar */}
      <nav className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-xl tracking-tight">Ethers<span className="text-primary">.Academy</span></span>
          </div>
          
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Playground
            </Link>
            <a href="https://docs.ethers.org/v6/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <Book className="w-4 h-4" /> Docs
            </a>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8 relative z-10">
        {children}
      </main>
      
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />
    </div>
  );
}
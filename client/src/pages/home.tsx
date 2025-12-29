import { usePortfolio } from '@/hooks/use-portfolio';
import { PortfolioForm } from '@/components/portfolio-form';
import { PortfolioSummary } from '@/components/portfolio-summary';
import { PortfolioList } from '@/components/portfolio-list';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock } from 'lucide-react';
import { format } from 'date-fns';
import bgImage from '@assets/generated_images/dark_abstract_data_background.png';

export default function Home() {
  const { 
    transactions, 
    btcPrice, 
    lastUpdated, 
    isLoading, 
    addTransaction, 
    removeTransaction, 
    refreshPrice 
  } = usePortfolio();

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Background Image Layer */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Gradient Overlay for better text readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background/80 via-background/90 to-background pointer-events-none" />

      <main className="container mx-auto p-6 md:p-8 relative z-10 max-w-6xl space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/40 pb-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Bitcoin Tracker
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your portfolio and track profit/loss in real-time.
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
               <span className="text-sm text-muted-foreground flex items-center gap-1">
                 <Clock className="h-3 w-3" />
                 Last updated: {lastUpdated ? format(lastUpdated, 'HH:mm:ss') : 'Never'}
               </span>
               <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={() => refreshPrice()} 
                 disabled={isLoading}
                 className="h-8 border-primary/20 hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all"
                 data-testid="button-refresh-price"
               >
                 <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                 Refresh
               </Button>
            </div>
            {btcPrice && (
              <div className="text-3xl font-mono font-bold text-primary animate-in fade-in slide-in-from-right-4 duration-500">
                ${btcPrice.toLocaleString()}
              </div>
            )}
          </div>
        </header>

        {/* Stats Summary */}
        <section>
          <PortfolioSummary 
            transactions={transactions} 
            currentPrice={btcPrice} 
            isLoading={isLoading} 
          />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form Column */}
          <div className="lg:col-span-1">
            <PortfolioForm onAdd={addTransaction} currentPrice={btcPrice} />
          </div>

          {/* List Column */}
          <div className="lg:col-span-2">
             <PortfolioList 
               transactions={transactions} 
               onRemove={removeTransaction} 
               currentPrice={btcPrice} 
             />
          </div>
        </div>
        
      </main>
    </div>
  );
}

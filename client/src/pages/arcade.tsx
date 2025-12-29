import { useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useArcadePortfolio } from '@/hooks/use-arcade-portfolio';
import { useAuth } from '@/hooks/use-auth';
import { PortfolioForm } from '@/components/portfolio-form';
import { PortfolioSummary } from '@/components/portfolio-summary';
import { PortfolioList } from '@/components/portfolio-list';
import { PortfolioChart } from '@/components/portfolio-chart';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { RefreshCw, Clock, LogOut, Gamepad2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import bgImage from '@assets/generated_images/dark_abstract_data_background.png';

export default function Arcade() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  
  const { 
    transactions, 
    btcPrice, 
    lastUpdated, 
    isLoading, 
    addTransaction,
    editTransaction,
    removeTransaction, 
    refreshPrice 
  } = useArcadePortfolio();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, authLoading, setLocation]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-purple-950/30 via-background/90 to-background pointer-events-none" />
      <main className="container mx-auto px-4 py-6 sm:p-6 md:p-8 relative z-10 max-w-6xl space-y-6 sm:space-y-8">
        
        <header className="flex flex-col gap-3 sm:gap-4 border-b border-purple-500/40 pb-4 sm:pb-6">
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <Gamepad2 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 flex-shrink-0" />
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                  Arcade
                </h1>
              </div>
              <p className="text-muted-foreground text-xs sm:text-base md:text-lg">Hypothetical transactions playground</p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {btcPrice && (
                <div className="text-lg sm:text-3xl font-mono font-bold text-purple-400 animate-in fade-in slide-in-from-right-4 duration-500">
                  ${btcPrice.toLocaleString()}
                </div>
              )}
              
              {user && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                    <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || 'User'} />
                    <AvatarFallback className="text-xs">{user.firstName?.[0] || user.email?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => logout()}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-muted-foreground hover:text-foreground"
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-sm text-muted-foreground flex items-center gap-1 flex-shrink-0">
              <Clock className="h-3 w-3" />
              {lastUpdated ? format(lastUpdated, 'HH:mm:ss') : 'Never'}
            </span>
            <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-end">
              <Link href="/portfolio">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 sm:h-8 px-2 sm:px-3 border-primary/20 hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all"
                  data-testid="button-back-portfolio"
                >
                  <ArrowLeft className="h-3.5 w-3.5 sm:mr-1.5" />
                  <span className="hidden sm:inline">Portfolio</span>
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refreshPrice()} 
                disabled={isLoading}
                className="h-8 sm:h-8 px-2 sm:px-3 border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10 hover:text-purple-400 transition-all"
                data-testid="button-refresh-price"
              >
                <RefreshCw className={`h-3.5 w-3.5 sm:mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 sm:p-4 text-center">
          <p className="text-purple-300 text-xs sm:text-sm">
            This is your playground! Transactions here are hypothetical and won't affect your real portfolio.
          </p>
        </div>

        <section>
          <PortfolioSummary 
            transactions={transactions} 
            currentPrice={btcPrice} 
            isLoading={isLoading} 
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1">
            <PortfolioForm onAdd={addTransaction} currentPrice={btcPrice} />
          </div>

          <div className="lg:col-span-2">
             <PortfolioList 
               transactions={transactions} 
               onRemove={removeTransaction}
               onEdit={editTransaction}
               currentPrice={btcPrice} 
             />
          </div>
        </div>

        {/* Portfolio Value Chart */}
        <section>
          <PortfolioChart transactions={transactions} currentPrice={btcPrice} />
        </section>
        
      </main>
    </div>
  );
}

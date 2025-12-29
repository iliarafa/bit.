import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/lib/types';
import { ArrowUpRight, ArrowDownRight, Wallet, Bitcoin, DollarSign, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface PortfolioSummaryProps {
  transactions: Transaction[];
  currentPrice: number | null;
  isLoading: boolean;
}

export function PortfolioSummary({ transactions, currentPrice, isLoading }: PortfolioSummaryProps) {
  const totalBTC = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalInvestment = transactions.reduce((acc, t) => acc + (t.amount * t.priceAtPurchase), 0);
  const currentValue = currentPrice ? totalBTC * currentPrice : 0;
  const profit = currentValue - totalInvestment;
  const profitPercentage = totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;

  const isProfit = profit >= 0;

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  const formatBTC = (val: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 8, maximumFractionDigits: 8 }).format(val);

  const StatCard = ({ title, value, subValue, icon: Icon, trend }: any) => (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono tracking-tight">
           {isLoading && title === "Current Value" ? "Loading..." : value}
        </div>
        {(subValue || trend) && (
          <p className={`text-xs mt-1 flex items-center ${
            trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
          }`}>
             {trend === 'up' && <ArrowUpRight className="h-3 w-3 mr-1" />}
             {trend === 'down' && <ArrowDownRight className="h-3 w-3 mr-1" />}
             {subValue}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <StatCard 
          title="Total Bitcoin" 
          value={formatBTC(totalBTC)} 
          subValue="BTC Holdings"
          icon={Bitcoin}
        />
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <StatCard 
          title="Total Investment" 
          value={formatCurrency(totalInvestment)} 
          subValue="Cost Basis"
          icon={Wallet}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <StatCard 
          title="Current Value" 
          value={formatCurrency(currentValue)} 
          subValue={currentPrice ? `@ ${formatCurrency(currentPrice)}/BTC` : 'Fetching price...'}
          icon={DollarSign}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <StatCard 
          title="Total Profit/Loss" 
          value={formatCurrency(profit)} 
          subValue={`${profitPercentage.toFixed(2)}% Return`}
          icon={TrendingUp}
          trend={isProfit ? 'up' : 'down'}
        />
      </motion.div>
    </div>
  );
}

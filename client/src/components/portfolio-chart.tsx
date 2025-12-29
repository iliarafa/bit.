import { useMemo } from 'react';
import { Transaction } from '@/hooks/use-portfolio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

interface PortfolioChartProps {
  transactions: Transaction[];
  currentPrice: number | null;
}

export function PortfolioChart({ transactions, currentPrice }: PortfolioChartProps) {
  const chartData = useMemo(() => {
    if (transactions.length === 0 || !currentPrice) return [];

    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const dataPoints: { date: string; value: number; label: string }[] = [];
    let runningBTC = 0;

    sortedTransactions.forEach((t) => {
      if (t.type === 'buy') {
        runningBTC += t.amount;
      } else {
        runningBTC -= t.amount;
      }

      const valueAtTransaction = runningBTC * t.priceAtPurchase;
      
      dataPoints.push({
        date: new Date(t.date).toISOString(),
        value: Math.max(0, valueAtTransaction),
        label: format(new Date(t.date), 'MMM dd'),
      });
    });

    const currentValue = runningBTC * currentPrice;
    dataPoints.push({
      date: new Date().toISOString(),
      value: Math.max(0, currentValue),
      label: 'Today',
    });

    return dataPoints;
  }, [transactions, currentPrice]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  if (transactions.length === 0 || !currentPrice || chartData.length === 0) {
    return null;
  }

  const firstValue = chartData[0]?.value || 0;
  const lastValue = chartData[chartData.length - 1]?.value || 0;
  const change = lastValue - firstValue;
  const changePercent = firstValue > 0 ? (change / firstValue) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm" data-testid="section-portfolio-chart">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg">Portfolio Value Over Time</CardTitle>
          <div 
            className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}
            data-testid="text-portfolio-change"
          >
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{isPositive ? '+' : ''}{changePercent.toFixed(1)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[200px] sm:h-[250px] w-full" data-testid="chart-portfolio-value">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F7931A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F7931A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#888' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                tick={{ fontSize: 10, fill: '#888' }}
                tickLine={false}
                axisLine={false}
                width={45}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(247,147,26,0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: number) => [formatCurrency(value), 'Value']}
                labelStyle={{ color: '#888' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#F7931A"
                strokeWidth={2}
                fill="url(#colorValue)"
                dot={{ r: 4, fill: "#F7931A", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#F7931A", strokeWidth: 2, stroke: "#000" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

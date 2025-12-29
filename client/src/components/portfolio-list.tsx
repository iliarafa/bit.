import { Transaction } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface PortfolioListProps {
  transactions: Transaction[];
  onRemove: (id: string) => void;
  currentPrice: number | null;
}

export function PortfolioList({ transactions, onRemove, currentPrice }: PortfolioListProps) {
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  
  if (transactions.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm min-h-[300px] flex items-center justify-center text-center">
        <CardContent className="pt-6">
           <div className="text-muted-foreground">No transactions yet. Add your first Bitcoin purchase above.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <CardTitle>Purchase History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount (BTC)</TableHead>
              <TableHead>Buy Price</TableHead>
              <TableHead>Cost Basis</TableHead>
              <TableHead>Current Value</TableHead>
              <TableHead>P/L</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => {
              const cost = t.amount * t.priceAtPurchase;
              const currentVal = currentPrice ? t.amount * currentPrice : 0;
              const pl = currentVal - cost;
              const isProfit = pl >= 0;

              return (
                <TableRow key={t.id} className="group hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {format(new Date(t.date), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell className="font-mono font-medium">{t.amount}</TableCell>
                  <TableCell className="font-mono">{formatCurrency(t.priceAtPurchase)}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{formatCurrency(cost)}</TableCell>
                  <TableCell className="font-mono">
                     {currentPrice ? formatCurrency(currentVal) : '...'}
                  </TableCell>
                  <TableCell className={`font-mono ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                    {currentPrice ? `${pl > 0 ? '+' : ''}${formatCurrency(pl)}` : '...'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onRemove(t.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                      data-testid={`button-delete-${t.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

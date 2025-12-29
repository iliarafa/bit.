import { useState } from 'react';
import { Transaction } from '@/hooks/use-portfolio';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { EditTransactionDialog } from './edit-transaction-dialog';

interface PortfolioListProps {
  transactions: Transaction[];
  onRemove: (id: string) => void;
  onEdit: (id: string, type: 'buy' | 'send', amount: number, totalCost: number, date: string) => void;
  currentPrice: number | null;
}

function MobileTransactionCard({ t, onRemove, onEdit, currentPrice, formatCurrency }: { 
  t: Transaction; 
  onRemove: (id: string) => void;
  onEdit: () => void;
  currentPrice: number | null;
  formatCurrency: (val: number) => string;
}) {
  const cost = t.amount * t.priceAtPurchase;
  const currentVal = currentPrice ? t.amount * currentPrice : 0;
  const pl = t.type === 'buy' ? currentVal - cost : 0;
  const isProfit = pl >= 0;
  const isSend = t.type === 'send';

  return (
    <Card className={`border-border/50 backdrop-blur-sm ${isSend ? 'bg-red-500/5' : 'bg-card/80'}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={isSend ? "destructive" : "default"} className="text-xs">
              {isSend ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownLeft className="h-3 w-3 mr-1" />}
              {isSend ? 'Sent' : 'Buy'}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(t.date), 'MMM dd, yyyy')}
            </span>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={onEdit}
              data-testid={`button-edit-mobile-${t.id}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onRemove(t.id)}
              data-testid={`button-delete-mobile-${t.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Amount</p>
            <p className="font-mono font-semibold">{isSend ? '-' : ''}{t.amount} BTC</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{isSend ? 'Price at Send' : 'Buy Price'}</p>
            <p className="font-mono">{formatCurrency(t.priceAtPurchase)}/BTC</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{isSend ? 'Value Sent' : 'Cost Basis'}</p>
            <p className="font-mono text-muted-foreground">{formatCurrency(cost)}</p>
          </div>
          {!isSend && (
            <div>
              <p className="text-xs text-muted-foreground">Current Value</p>
              <p className="font-mono">{currentPrice ? formatCurrency(currentVal) : '...'}</p>
            </div>
          )}
        </div>
        
        {!isSend && (
          <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Profit/Loss</span>
            <div className={`flex items-center gap-1 font-mono font-semibold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
              {isProfit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {currentPrice ? `${pl > 0 ? '+' : ''}${formatCurrency(pl)}` : '...'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function PortfolioList({ transactions, onRemove, onEdit, currentPrice }: PortfolioListProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  
  if (transactions.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm min-h-[200px] flex items-center justify-center text-center">
        <CardContent className="pt-6">
          <div className="text-muted-foreground">No transactions yet. Add your first Bitcoin purchase above.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <EditTransactionDialog
        transaction={editingTransaction}
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
        onSave={onEdit}
      />

      {/* Mobile view - card list */}
      <div className="md:hidden space-y-3">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        {transactions.map((t) => (
          <MobileTransactionCard 
            key={t.id} 
            t={t} 
            onRemove={onRemove}
            onEdit={() => setEditingTransaction(t)}
            currentPrice={currentPrice}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>

      {/* Desktop view - table */}
      <Card className="hidden md:block border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount (BTC)</TableHead>
                  <TableHead>Price/BTC</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>P/L</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => {
                  const cost = t.amount * t.priceAtPurchase;
                  const currentVal = currentPrice ? t.amount * currentPrice : 0;
                  const pl = t.type === 'buy' ? currentVal - cost : 0;
                  const isProfit = pl >= 0;
                  const isSend = t.type === 'send';

                  return (
                    <TableRow key={t.id} className={`group hover:bg-muted/50 transition-colors ${isSend ? 'bg-red-500/5' : ''}`}>
                      <TableCell>
                        <Badge variant={isSend ? "destructive" : "default"} className="text-xs">
                          {isSend ? 'Sent' : 'Buy'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {format(new Date(t.date), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell className={`font-mono font-medium ${isSend ? 'text-red-500' : ''}`}>
                        {isSend ? '-' : '+'}{t.amount}
                      </TableCell>
                      <TableCell className="font-mono">{formatCurrency(t.priceAtPurchase)}</TableCell>
                      <TableCell className="font-mono text-muted-foreground">{formatCurrency(cost)}</TableCell>
                      <TableCell className="font-mono">
                        {isSend ? '-' : (currentPrice ? formatCurrency(currentVal) : '...')}
                      </TableCell>
                      <TableCell className={`font-mono ${isSend ? 'text-muted-foreground' : (isProfit ? 'text-green-500' : 'text-red-500')}`}>
                        {isSend ? '-' : (currentPrice ? `${pl > 0 ? '+' : ''}${formatCurrency(pl)}` : '...')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setEditingTransaction(t)}
                            className="opacity-50 hover:opacity-100 transition-opacity"
                            data-testid={`button-edit-${t.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => onRemove(t.id)}
                            className="opacity-50 hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                            data-testid={`button-delete-${t.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

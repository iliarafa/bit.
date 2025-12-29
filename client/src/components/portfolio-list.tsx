import { useState, useMemo } from 'react';
import { Transaction } from '@/hooks/use-portfolio';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Calendar, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Pencil, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';
import { EditTransactionDialog } from './edit-transaction-dialog';

interface PortfolioListProps {
  transactions: Transaction[];
  onRemove: (id: string) => void;
  onEdit: (id: string, type: 'buy' | 'send', amount: number, totalCost: number, date: string) => void;
  currentPrice: number | null;
}

type SortField = 'date' | 'amount' | 'price' | 'value' | 'type';
type SortDirection = 'asc' | 'desc';

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
      <CardContent className="p-3 sm:p-4">
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <Badge variant={isSend ? "destructive" : "default"} className="text-[10px] sm:text-xs px-1.5 sm:px-2">
              {isSend ? <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" /> : <ArrowDownLeft className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />}
              {isSend ? 'Sent' : 'Buy'}
            </Badge>
            <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              {format(new Date(t.date), 'MMM dd, yyyy')}
            </span>
          </div>
          <div className="flex gap-0.5 sm:gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground touch-manipulation"
              onClick={onEdit}
              data-testid={`button-edit-mobile-${t.id}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 sm:h-8 sm:w-8 text-destructive hover:text-destructive hover:bg-destructive/10 touch-manipulation"
              onClick={() => onRemove(t.id)}
              data-testid={`button-delete-mobile-${t.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Amount</p>
            <p className="font-mono font-semibold text-sm sm:text-base">{isSend ? '-' : ''}{t.amount} BTC</p>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">{isSend ? 'Price at Send' : 'Buy Price'}</p>
            <p className="font-mono text-sm sm:text-base">{formatCurrency(t.priceAtPurchase)}/BTC</p>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">{isSend ? 'Value Sent' : 'Cost Basis'}</p>
            <p className="font-mono text-muted-foreground text-sm sm:text-base">{formatCurrency(cost)}</p>
          </div>
          {!isSend && (
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Current Value</p>
              <p className="font-mono text-sm sm:text-base">{currentPrice ? formatCurrency(currentVal) : '...'}</p>
            </div>
          )}
        </div>
        
        {!isSend && (
          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border/50 flex items-center justify-between">
            <span className="text-[10px] sm:text-xs text-muted-foreground">Profit/Loss</span>
            <div className={`flex items-center gap-1 font-mono font-semibold text-sm sm:text-base ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
              {isProfit ? <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              {currentPrice ? `${pl > 0 ? '+' : ''}${formatCurrency(pl)}` : '...'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SortableHeader({ 
  label, 
  field, 
  currentSort, 
  currentDirection, 
  onSort 
}: { 
  label: string; 
  field: SortField; 
  currentSort: SortField; 
  currentDirection: SortDirection;
  onSort: (field: SortField) => void;
}) {
  const isActive = currentSort === field;
  
  return (
    <TableHead 
      className="cursor-pointer hover:bg-muted/30 transition-colors select-none"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive ? (
          currentDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-30" />
        )}
      </div>
    </TableHead>
  );
}

export function PortfolioList({ transactions, onRemove, onEdit, currentPrice }: PortfolioListProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [mobileSortField, setMobileSortField] = useState<SortField>('date');
  
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => {
      let aVal: number, bVal: number;
      
      switch (sortField) {
        case 'date':
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
          break;
        case 'amount':
          aVal = a.amount;
          bVal = b.amount;
          break;
        case 'price':
          aVal = a.priceAtPurchase;
          bVal = b.priceAtPurchase;
          break;
        case 'value':
          aVal = a.amount * a.priceAtPurchase;
          bVal = b.amount * b.priceAtPurchase;
          break;
        case 'type':
          aVal = a.type === 'buy' ? 0 : 1;
          bVal = b.type === 'buy' ? 0 : 1;
          break;
        default:
          return 0;
      }
      
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
    
    return sorted;
  }, [transactions, sortField, sortDirection]);

  const mobileSortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      let aVal: number, bVal: number;
      
      switch (mobileSortField) {
        case 'date':
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
          break;
        case 'amount':
          aVal = a.amount;
          bVal = b.amount;
          break;
        case 'price':
          aVal = a.priceAtPurchase;
          bVal = b.priceAtPurchase;
          break;
        case 'value':
          aVal = a.amount * a.priceAtPurchase;
          bVal = b.amount * b.priceAtPurchase;
          break;
        case 'type':
          aVal = a.type === 'buy' ? 0 : 1;
          bVal = b.type === 'buy' ? 0 : 1;
          break;
        default:
          return 0;
      }
      
      return bVal - aVal;
    });
  }, [transactions, mobileSortField]);
  
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Transaction History</h3>
          <Select value={mobileSortField} onValueChange={(v) => setMobileSortField(v as SortField)}>
            <SelectTrigger className="w-[140px] h-8" data-testid="mobile-sort-select">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="value">Total Value</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {mobileSortedTransactions.map((t) => (
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
                  <SortableHeader label="Type" field="type" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader label="Date" field="date" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader label="Amount (BTC)" field="amount" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader label="Price/BTC" field="price" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader label="Total Value" field="value" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort} />
                  <TableHead>Current Value</TableHead>
                  <TableHead>P/L</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.map((t) => {
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

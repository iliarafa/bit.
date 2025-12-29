import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Transaction } from '@/hooks/use-portfolio';

interface EditTransactionDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, type: 'buy' | 'send', amount: number, totalCost: number, date: string) => void;
}

export function EditTransactionDialog({ transaction, open, onOpenChange, onSave }: EditTransactionDialogProps) {
  const [type, setType] = useState<'buy' | 'send'>('buy');
  const [amount, setAmount] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      const cost = transaction.amount * transaction.priceAtPurchase;
      setTotalCost(cost.toString());
      const d = new Date(transaction.date);
      setDate(d.toISOString().slice(0, 16));
    }
  }, [transaction]);

  const handleSave = () => {
    if (!transaction || !amount || !totalCost || !date) return;
    onSave(transaction.id, type, Number(amount), Number(totalCost), new Date(date).toISOString());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[calc(100vw-2rem)] mx-4">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Edit Transaction</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
          <Tabs value={type} onValueChange={(v) => setType(v as 'buy' | 'send')}>
            <TabsList className="grid w-full grid-cols-2 h-10 sm:h-9">
              <TabsTrigger value="buy" className="text-sm">Buy</TabsTrigger>
              <TabsTrigger value="send" className="text-sm">Send</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="amount" className="text-xs sm:text-sm">BTC Amount</Label>
            <Input
              id="amount"
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="font-mono h-11 sm:h-10 text-base sm:text-sm"
              data-testid="edit-input-amount"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="totalCost" className="text-xs sm:text-sm">{type === 'buy' ? 'Total Cost (USD)' : 'Value at Send (USD)'}</Label>
            <Input
              id="totalCost"
              type="number"
              step="any"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              className="font-mono h-11 sm:h-10 text-base sm:text-sm"
              data-testid="edit-input-cost"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="date" className="text-xs sm:text-sm">Transaction Date</Label>
            <Input
              id="date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="font-mono h-11 sm:h-10 text-base sm:text-sm"
              data-testid="edit-input-date"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto h-11 sm:h-10">
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-edit" className="w-full sm:w-auto h-11 sm:h-10">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

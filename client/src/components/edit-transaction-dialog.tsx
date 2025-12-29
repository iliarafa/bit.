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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Tabs value={type} onValueChange={(v) => setType(v as 'buy' | 'send')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy">Buy</TabsTrigger>
              <TabsTrigger value="send">Send</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="amount">BTC Amount</Label>
            <Input
              id="amount"
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="font-mono"
              data-testid="edit-input-amount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalCost">{type === 'buy' ? 'Total Cost (USD)' : 'Value at Send (USD)'}</Label>
            <Input
              id="totalCost"
              type="number"
              step="any"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              className="font-mono"
              data-testid="edit-input-cost"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Transaction Date</Label>
            <Input
              id="date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="font-mono"
              data-testid="edit-input-date"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-edit">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

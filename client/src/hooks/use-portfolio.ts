import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export interface Transaction {
  id: string;
  type: 'buy' | 'send';
  amount: number;
  priceAtPurchase: number;
  date: string;
}

interface ApiTransaction {
  id: string;
  type?: string;
  amount: number;
  priceAtPurchase?: number;
  price_at_purchase?: number;
  date: string;
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

function normalizeTransaction(t: ApiTransaction): Transaction {
  return {
    id: t.id,
    type: (t.type as 'buy' | 'send') || 'buy',
    amount: Number(t.amount),
    priceAtPurchase: Number(t.priceAtPurchase ?? t.price_at_purchase ?? 0),
    date: t.date,
  };
}

async function fetchTransactions(): Promise<Transaction[]> {
  const res = await fetch('/api/transactions');
  if (!res.ok) throw new Error('Failed to fetch transactions');
  const data: ApiTransaction[] = await res.json();
  return data.map(normalizeTransaction);
}

async function createTransaction(data: { type: string; amount: number; priceAtPurchase: number; date?: string }): Promise<Transaction> {
  const res = await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create transaction');
  const result = await res.json();
  return normalizeTransaction(result);
}

async function updateTransactionApi(data: { id: string; type: string; amount: number; priceAtPurchase: number; date: string }): Promise<Transaction> {
  const res = await fetch(`/api/transactions/${data.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: data.type,
      amount: data.amount,
      priceAtPurchase: data.priceAtPurchase,
      date: data.date,
    }),
  });
  if (!res.ok) throw new Error('Failed to update transaction');
  const result = await res.json();
  return normalizeTransaction(result);
}

async function deleteTransaction(id: string): Promise<void> {
  const res = await fetch(`/api/transactions/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete transaction');
}

export function usePortfolio() {
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: (newTx) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      const action = newTx.type === 'buy' ? 'Bought' : 'Sent';
      toast({
        title: "Transaction Added",
        description: `${action} ${newTx.amount} BTC`
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add transaction.",
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateTransactionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Transaction Updated",
        description: "Changes saved successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update transaction.",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Transaction Removed",
        description: "Entry deleted from portfolio."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete transaction.",
        variant: "destructive"
      });
    }
  });

  const fetchPrice = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(COINGECKO_API);
      if (!res.ok) throw new Error('Failed to fetch price');
      const data = await res.json();
      setBtcPrice(data.bitcoin.usd);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching BTC price:', error);
      toast({
        title: "Price Update Failed",
        description: "Could not fetch current Bitcoin price.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const addTransaction = (type: 'buy' | 'send', amount: number, totalCost: number, date?: string) => {
    const priceAtPurchase = totalCost / amount;
    createMutation.mutate({ type, amount, priceAtPurchase, date });
  };

  const editTransaction = (id: string, type: 'buy' | 'send', amount: number, totalCost: number, date: string) => {
    const priceAtPurchase = totalCost / amount;
    updateMutation.mutate({ id, type, amount, priceAtPurchase, date });
  };

  const removeTransaction = (id: string) => {
    deleteMutation.mutate(id);
  };

  return {
    transactions,
    btcPrice,
    lastUpdated,
    isLoading: isLoading || isLoadingTransactions,
    addTransaction,
    editTransaction,
    removeTransaction,
    refreshPrice: fetchPrice
  };
}

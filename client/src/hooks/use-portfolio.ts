import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  amount: number;
  priceAtPurchase: number;
  date: string;
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

async function fetchTransactions(): Promise<Transaction[]> {
  const res = await fetch('/api/transactions');
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

async function createTransaction(data: { amount: number; priceAtPurchase: number }): Promise<Transaction> {
  const res = await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create transaction');
  return res.json();
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Transaction Added",
        description: "Added BTC to your portfolio."
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

  const addTransaction = (amount: number, priceAtPurchase: number) => {
    createMutation.mutate({ amount, priceAtPurchase });
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
    removeTransaction,
    refreshPrice: fetchPrice
  };
}

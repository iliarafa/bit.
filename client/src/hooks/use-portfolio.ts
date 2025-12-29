import { useState, useEffect } from 'react';
import { Transaction } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'btc_portfolio_transactions';
const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

export function usePortfolio() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

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
    const interval = setInterval(fetchPrice, 60000); // 60 seconds
    return () => clearInterval(interval);
  }, []);

  const addTransaction = (amount: number, priceAtPurchase: number) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount,
      priceAtPurchase,
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    toast({
      title: "Transaction Added",
      description: `Added ${amount} BTC to your portfolio.`
    });
  };

  const removeTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transaction Removed",
      description: "Entry deleted from portfolio."
    });
  };

  return {
    transactions,
    btcPrice,
    lastUpdated,
    isLoading,
    addTransaction,
    removeTransaction,
    refreshPrice: fetchPrice
  };
}

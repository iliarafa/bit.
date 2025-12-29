export interface Transaction {
  id: string;
  amount: number;
  priceAtPurchase: number;
  date: string;
}

export interface PortfolioStats {
  totalBTC: number;
  totalInvestment: number;
  currentValue: number;
  profit: number;
  profitPercentage: number;
}

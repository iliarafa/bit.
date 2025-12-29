# Bit. - Bitcoin Portfolio Tracker

Track your Bitcoin purchases and sends in real-time. View profit/loss with live prices from CoinGecko, export data as CSV/PDF, practice with Arcade mode, and visualize your portfolio value over time.

## Features

- **Real-Time Tracking** - Live Bitcoin prices from CoinGecko API update your portfolio value automatically
- **Transaction Management** - Add, edit, and delete buy/send transactions with date, amount, and price details
- **Profit/Loss Calculation** - See your total investment, current value, and percentage gains or losses
- **Portfolio Chart** - Visualize your portfolio value progression from first transaction to today
- **Arcade Mode** - Practice trading strategies with hypothetical transactions without affecting your real portfolio
- **Data Export** - Download your transaction history as CSV or PDF
- **Secure Authentication** - Private portfolios protected with Replit Auth login
- **Mobile Responsive** - Fully optimized for all screen sizes

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- Recharts for data visualization
- TanStack React Query for data fetching
- Wouter for routing

### Backend
- Node.js with Express
- TypeScript
- Drizzle ORM
- PostgreSQL database

### APIs
- CoinGecko API for live Bitcoin prices

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```
   DATABASE_URL=your_postgresql_connection_string
   ```
4. Push database schema:
   ```bash
   npm run db:push
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5000`

## Usage

1. Click "Bit." on the landing page to log in with your Replit account
2. Add your first Bitcoin transaction using the "Add Transaction" button
3. Enter the BTC amount, total cost paid, and date
4. View your portfolio summary with real-time profit/loss calculations
5. Use Arcade mode (rocket icon) to practice with hypothetical trades
6. Export your data using the download button in CSV or PDF format

## License

MIT

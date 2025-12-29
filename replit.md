# Bit. - Bitcoin Portfolio Tracker

## Overview

Bit. is a real-time Bitcoin portfolio tracking application that allows users to record buy and send transactions, monitor current portfolio value using live BTC prices from CoinGecko, and calculate profit/loss metrics. The app supports data export in multiple formats (CSV, Excel, PDF).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state, React hooks for local state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom Bitcoin-themed dark color scheme
- **Animations**: Framer Motion for smooth transitions
- **Forms**: React Hook Form with Zod validation

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/`
- Reusable components in `client/src/components/`
- Custom hooks in `client/src/hooks/`
- UI primitives in `client/src/components/ui/`

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful JSON API under `/api/` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod schemas shared between client and server via `drizzle-zod`

Key backend files:
- `server/index.ts` - Express app setup and middleware
- `server/routes.ts` - API route definitions
- `server/storage.ts` - Database access layer implementing IStorage interface
- `server/db.ts` - Database connection configuration

### Data Storage
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema**: Defined in `shared/schema.ts` using Drizzle ORM
- **Tables**:
  - `users` - User accounts (id, username, password)
  - `transactions` - BTC transactions (id, type, amount, priceAtPurchase, date)
- **Migrations**: Managed via `drizzle-kit push` command

### Build System
- **Development**: Vite dev server with HMR for frontend, tsx for backend
- **Production**: Custom build script using esbuild for server bundling, Vite for client
- **Output**: Server bundle to `dist/index.cjs`, client assets to `dist/public/`

## External Dependencies

### APIs
- **CoinGecko API**: Fetches real-time Bitcoin price in USD
  - Endpoint: `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`
  - No authentication required for basic usage

### Database
- **PostgreSQL**: Primary data store
  - Connection via `DATABASE_URL` environment variable
  - Uses `pg` (node-postgres) driver with connection pooling

### Export Libraries
- **jsPDF + jspdf-autotable**: PDF generation for portfolio reports
- **xlsx**: Excel file generation for data export

### UI Dependencies
- **Radix UI**: Accessible component primitives (dialog, dropdown, tabs, etc.)
- **Lucide React**: Icon library
- **date-fns**: Date formatting utilities
- **class-variance-authority**: Component variant management
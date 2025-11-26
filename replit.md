# NSE Tracker - Nairobi Stock Exchange Tracker

## Overview

NSE Tracker is a comprehensive stock tracking application for the Nairobi Stock Exchange (NSE). The platform provides real-time stock data, personalized watchlists, AI-driven market insights, broker performance analytics, and market news aggregation. Built with a focus on data clarity and trustworthy financial interface design, the application serves Kenyan investors with tools to monitor stocks, analyze market trends, and make informed investment decisions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework Stack:**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and data fetching

**UI Component System:**
- shadcn/ui component library (Radix UI primitives) for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Design system follows Robinhood/Stripe/Linear aesthetic principles emphasizing data clarity
- Inter font family via Google Fonts CDN
- Custom color system with CSS variables supporting light/dark themes
- Responsive design with mobile-first approach

**State Management:**
- React Query for server state (stocks, watchlist, news, brokers)
- React Context for theme management (light/dark mode)
- Local component state for UI interactions
- Optimistic updates and cache invalidation patterns for watchlist mutations

**Key Pages:**
- Dashboard: Market overview, stock listings, news feed, broker rankings
- Stock Detail: Individual stock analytics, price charts, AI insights, related news
- Broker Detail: Broker performance metrics, portfolio holdings, investment analytics

### Backend Architecture

**Runtime & Framework:**
- Node.js with Express.js for REST API
- TypeScript with ES modules
- Development mode uses Vite middleware for HMR (Hot Module Replacement)
- Production mode serves pre-built static assets

**API Structure:**
- RESTful endpoints organized by resource type:
  - `/api/stocks` - Stock data and individual stock details
  - `/api/watchlist` - User watchlist CRUD operations
  - `/api/news` - Market news and announcements
  - `/api/brokers` - Broker performance and investment data
  - `/api/stocks/:id/insights` - AI-generated stock insights
  - `/api/brokers/:id/insights` - AI-generated broker insights

**Data Layer:**
- In-memory storage (MemStorage class) for development/demo with seed data
- Drizzle ORM configured for PostgreSQL (production-ready)
- Schema-first approach with Zod validation
- 50+ NSE stocks seeded across banking, telecommunications, manufacturing, energy, and real estate sectors

**AI Integration:**
- OpenAI GPT-5 integration for generating market insights
- Fallback logic for generating insights when API unavailable
- Context-aware analysis incorporating stock performance, news sentiment, and market trends
- Recommendation engine (BUY/SELL/HOLD) based on multiple factors

### Data Storage Solutions

**Database Configuration:**
- PostgreSQL via Neon serverless driver (@neondatabase/serverless)
- Drizzle ORM for type-safe database queries
- Schema defined in `shared/schema.ts` with shared types between client/server
- Migration system via drizzle-kit

**Schema Design:**
- `stocks` table: Ticker, price data, volume, market cap, P/E ratio, sector classification
- `watchlist` table: User-stock associations with timestamps
- `news` table: Articles with categories (IPO, Market News, Company News), related stocks
- `brokers` table: Broker performance metrics, trading volume, market share
- `broker_investments` table: Broker portfolio holdings with percentage allocations

**Data Types:**
- Computed types (StockWithChange, BrokerInvestmentWithStock) merge related data
- Zod schemas for runtime validation of API inputs
- TypeScript types generated from Drizzle schema for compile-time safety

### Authentication and Authorization

Currently not implemented. The application operates as a public demo without user authentication. Future implementation would likely use:
- Session-based authentication (connect-pg-simple included for PostgreSQL session store)
- User-specific watchlists tied to authenticated sessions
- Role-based access for premium features

### Code Organization

**Monorepo Structure:**
- `/client` - React frontend application
- `/server` - Express backend with API routes
- `/shared` - Shared TypeScript types and schemas
- Path aliases configured: `@/` for client code, `@shared/` for shared types

**Development Workflow:**
- Separate dev and prod entry points (`index-dev.ts`, `index-prod.ts`)
- Vite middleware integration for development HMR
- Type checking via `tsc --noEmit`
- Build process: Vite for client, esbuild for server bundling

## External Dependencies

**Third-Party Services:**
- OpenAI API (GPT-5) for AI-driven market insights and stock analysis
- Google Fonts CDN for Inter font family
- Neon Database (PostgreSQL serverless) for production data storage

**Key NPM Packages:**
- **UI/Components:** @radix-ui/* primitives, recharts for data visualization
- **Data Fetching:** @tanstack/react-query for server state
- **Forms:** react-hook-form with @hookform/resolvers for validation
- **Styling:** tailwindcss, class-variance-authority, clsx for conditional classes
- **Database:** drizzle-orm, @neondatabase/serverless, drizzle-zod
- **Utilities:** date-fns for date formatting, nanoid for ID generation
- **Development:** Replit plugins for runtime error overlay and dev tooling

**Design Assets:**
- Custom favicon and meta tags for SEO
- Design guidelines documented in `design_guidelines.md`
- Shadcn configuration in `components.json` for component generation

**Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string (required for production)
- `OPENAI_API_KEY` - OpenAI API authentication
- `NODE_ENV` - Environment designation (development/production)
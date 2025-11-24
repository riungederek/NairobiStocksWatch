# Design Guidelines: Kenyan Stock Tracker

## Design Approach
**Reference-Based**: Drawing primarily from Robinhood's clean, data-forward aesthetic, combined with Stripe's refined polish and Linear's sharp modern feel. This creates a trustworthy financial interface that balances accessibility with sophistication.

## Core Design Principles
1. **Data Clarity First**: Every number, chart, and statistic must be immediately scannable
2. **Trust Through Simplicity**: Clean layouts build confidence in financial decisions
3. **Purposeful Hierarchy**: Critical information (prices, changes) dominates visual weight
4. **Responsive Data Density**: Dense on desktop, streamlined on mobile

---

## Typography System

**Primary Font**: Inter (via Google Fonts CDN)
- **Display/Numbers**: 700 weight for stock prices, percentage changes
- **Headings**: 600 weight for company names, section titles
- **Body**: 400 weight for descriptions, news articles
- **Small/Meta**: 500 weight for labels, timestamps

**Scale**:
- Hero Numbers (stock prices): text-4xl to text-6xl
- Company Names: text-xl to text-2xl
- Section Headers: text-lg to text-xl
- Body Text: text-base
- Labels/Meta: text-sm to text-xs

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16**
- Component padding: p-4, p-6, p-8
- Section spacing: py-8, py-12, py-16
- Card gaps: gap-4, gap-6
- Tight spacing for data rows: space-y-2

**Container Strategy**:
- Dashboard: max-w-7xl for main content
- Stock cards: Full-width grid with controlled column widths
- News feed: max-w-4xl for readability
- Company details: max-w-6xl

---

## Component Library

### Navigation
- **Top Bar**: Sticky header with logo, search bar, user profile
- Search: Prominent position, expandable on focus
- Quick actions: "Add Stock" button in header
- Mobile: Hamburger menu with slide-out navigation

### Dashboard Layout
**Three-Column Grid** (desktop):
1. **Left Sidebar (w-64)**: Watchlist with quick-access favorites
2. **Main Content (flex-1)**: Stock grid and charts
3. **Right Panel (w-80)**: News feed sidebar

**Mobile**: Single column, collapsible sections

### Stock Cards
- **Grid Layout**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- **Card Structure**: 
  - Company name + ticker (bold)
  - Large price display (text-3xl)
  - Percentage change with directional arrow
  - Mini sparkline chart (optional enhancement)
  - Volume in smaller text
- Hover state: Subtle lift effect (shadow change)
- Click: Navigate to detail page

### Company Detail Page
- **Hero Section**: Company name, current price (text-5xl), daily change
- **Chart Section**: Full-width interactive price chart (use Chart.js via CDN)
- **Stats Grid**: 2x3 or 3x3 grid showing Market Cap, Volume, 52W High/Low, P/E, etc.
- **About Section**: Company description, sector info
- **News Tab**: Filtered company-specific news

### News Feed
- **Card Design**: Image thumbnail (left), headline + source + timestamp (right)
- **Layout**: Vertical stack with dividers
- **Filtering**: Tabs for "All", "IPOs", "Market News", "My Watchlist"
- **Image Dimensions**: 120x80px thumbnails
- **Typography**: Headline (text-base, font-semibold), Source (text-sm), Time (text-xs)

### Forms & Interactions
- **Search Bar**: 
  - Large input field with icon prefix
  - Dropdown results showing company name, ticker, current price
  - Keyboard navigation support
- **Add to Watchlist**: Toggle button (star icon) with instant feedback
- **Filters**: Dropdown selects for sector, sort order (Top Gainers, Top Losers, Most Active)

---

## Data Visualization

**Charts** (use Chart.js):
- Line charts for price history
- Candlestick option for detailed view
- Time range selectors: 1D, 5D, 1M, 3M, 1Y, All
- Minimal grid lines, clean axes

**Indicators**:
- Up/down arrows for price movement
- Percentage badges (distinct styling for positive/negative)
- Volume bars beneath price charts

---

## Icons
**Library**: Heroicons (via CDN)
- Search: magnifying-glass
- Trending: arrow-trending-up/down
- News: newspaper
- Star: star (outline/filled for watchlist)
- Chart: chart-bar
- Menu: bars-3

---

## Page Structure

### Landing Page (Logged Out)
1. **Hero Section**: 
   - Bold headline: "Track Every NSE Stock with Confidence"
   - Subheading about real-time data and news
   - CTA button: "Start Tracking Free"
   - Hero image: Abstract financial graphs or Nairobi skyline blend
2. **Features Grid** (3 columns):
   - Real-time tracking
   - Personalized watchlist
   - IPO & news alerts
3. **Screenshots Section**: Dashboard preview on device mockups
4. **CTA Footer**: Sign-up prompt with email input

### Dashboard (Logged In)
- Prominent welcome message with market status
- "My Watchlist" section at top (personalized)
- "Trending Stocks" grid below
- News feed in sidebar or dedicated section
- Quick stats banner: NSE Index, Top Gainer, Top Loser

---

## Images

**Hero Image**: Modern financial visualization - abstract charts, data points, or Nairobi skyline with market overlay. Full-width, 60vh height. Place blurred-background buttons over image for CTAs.

**Stock Logos**: Small circular company logos (40x40px) next to tickers in cards and lists.

**News Thumbnails**: 16:9 aspect ratio images for news articles (source from article metadata).

**Screenshots**: Dashboard and mobile app mockups for landing page feature showcase.

---

## Responsiveness
- **Desktop (lg+)**: Three-column dashboard, side-by-side stats grids
- **Tablet (md)**: Two-column stock grid, news moves below main content
- **Mobile (base)**: Single column, collapsible watchlist drawer, bottom nav for key actions

---

## Key Differentiators from Generic Dashboards
- **Financial-First Typography**: Numbers dominate with extreme hierarchy
- **Real-Time Feel**: Subtle pulse animations on live price updates (very minimal)
- **Trust Signals**: Disclaimers, data timestamps, source attribution for news
- **Kenyan Context**: NSE branding elements, local company logos, KES currency formatting
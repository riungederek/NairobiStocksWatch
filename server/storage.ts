import { type Stock, type InsertStock, type Watchlist, type InsertWatchlist, type News, type InsertNews, type StockWithChange } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Stocks
  getAllStocks(): Promise<StockWithChange[]>;
  getStockById(id: string): Promise<Stock | undefined>;
  
  // Watchlist
  getWatchlist(): Promise<Watchlist[]>;
  addToWatchlist(item: InsertWatchlist): Promise<Watchlist>;
  removeFromWatchlist(id: string): Promise<void>;
  
  // News
  getAllNews(): Promise<News[]>;
}

export class MemStorage implements IStorage {
  private stocks: Map<string, Stock>;
  private watchlist: Map<string, Watchlist>;
  private news: Map<string, News>;

  constructor() {
    this.stocks = new Map();
    this.watchlist = new Map();
    this.news = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed 50+ major NSE stocks with realistic data
    const nseStocks: InsertStock[] = [
      // Banking Sector
      { id: "EQTY", ticker: "EQTY", name: "Equity Group Holdings", sector: "Banking", currentPrice: 52.50, previousClose: 51.25, dayHigh: 53.00, dayLow: 51.80, volume: 2450000, marketCap: 198500000000, week52High: 58.00, week52Low: 45.00, peRatio: 4.8 },
      { id: "KCB", ticker: "KCB", name: "KCB Group", sector: "Banking", currentPrice: 38.75, previousClose: 39.50, dayHigh: 39.25, dayLow: 38.50, volume: 1850000, marketCap: 154200000000, week52High: 42.00, week52Low: 35.00, peRatio: 3.9 },
      { id: "COOP", ticker: "COOP", name: "Co-operative Bank", sector: "Banking", currentPrice: 16.20, previousClose: 16.00, dayHigh: 16.35, dayLow: 15.95, volume: 3200000, marketCap: 98400000000, week52High: 17.50, week52Low: 14.00, peRatio: 5.2 },
      { id: "ABSA", ticker: "ABSA", name: "Absa Bank Kenya", sector: "Banking", currentPrice: 14.85, previousClose: 15.20, dayHigh: 15.30, dayLow: 14.70, volume: 980000, marketCap: 54300000000, week52High: 16.50, week52Low: 13.00, peRatio: 4.1 },
      { id: "SCBK", ticker: "SCBK", name: "Standard Chartered Bank", sector: "Banking", currentPrice: 158.00, previousClose: 160.00, dayHigh: 161.00, dayLow: 157.50, volume: 125000, marketCap: 68900000000, week52High: 175.00, week52Low: 145.00, peRatio: 6.3 },
      { id: "DTBK", ticker: "DTBK", name: "Diamond Trust Bank", sector: "Banking", currentPrice: 75.00, previousClose: 74.00, dayHigh: 76.00, dayLow: 74.50, volume: 420000, marketCap: 29800000000, week52High: 82.00, week52Low: 68.00, peRatio: 4.5 },
      { id: "I&M", ticker: "I&M", name: "I&M Holdings", sector: "Banking", currentPrice: 22.50, previousClose: 23.00, dayHigh: 23.25, dayLow: 22.25, volume: 680000, marketCap: 27100000000, week52High: 25.00, week52Low: 20.00, peRatio: 3.8 },
      { id: "NCBA", ticker: "NCBA", name: "NCBA Group", sector: "Banking", currentPrice: 35.25, previousClose: 35.00, dayHigh: 35.75, dayLow: 34.90, volume: 520000, marketCap: 40200000000, week52High: 38.00, week52Low: 31.00, peRatio: 4.2 },
      
      // Telecommunications
      { id: "SCOM", ticker: "SCOM", name: "Safaricom", sector: "Telecommunications", currentPrice: 18.95, previousClose: 18.50, dayHigh: 19.10, dayLow: 18.70, volume: 8500000, marketCap: 758400000000, week52High: 21.00, week52Low: 16.50, peRatio: 7.2 },
      
      // Manufacturing & Allied
      { id: "EABL", ticker: "EABL", name: "East African Breweries", sector: "Manufacturing", currentPrice: 142.00, previousClose: 145.00, dayHigh: 145.50, dayLow: 141.00, volume: 340000, marketCap: 109400000000, week52High: 160.00, week52Low: 135.00, peRatio: 11.5 },
      { id: "BAT", ticker: "BAT", name: "British American Tobacco", sector: "Manufacturing", currentPrice: 385.00, previousClose: 390.00, dayHigh: 392.00, dayLow: 383.00, volume: 45000, marketCap: 76500000000, week52High: 420.00, week52Low: 360.00, peRatio: 8.9 },
      { id: "UNGA", ticker: "UNGA", name: "Unga Group", sector: "Manufacturing", currentPrice: 28.50, previousClose: 27.75, dayHigh: 28.80, dayLow: 27.90, volume: 280000, marketCap: 11400000000, week52High: 32.00, week52Low: 24.00, peRatio: 15.3 },
      { id: "CARB", ticker: "CARB", name: "Carbacid Investments", sector: "Manufacturing", currentPrice: 9.85, previousClose: 9.50, dayHigh: 10.00, dayLow: 9.60, volume: 150000, marketCap: 1970000000, week52High: 11.00, week52Low: 8.50, peRatio: 12.1 },
      { id: "MUMIAS", ticker: "MUMIAS", name: "Mumias Sugar Company", sector: "Manufacturing", currentPrice: 0.45, previousClose: 0.48, dayHigh: 0.49, dayLow: 0.44, volume: 5200000, marketCap: 900000000, week52High: 0.75, week52Low: 0.35, peRatio: null },
      { id: "BOC", ticker: "BOC", name: "BOC Kenya", sector: "Manufacturing", currentPrice: 32.00, previousClose: 31.50, dayHigh: 32.50, dayLow: 31.75, volume: 95000, marketCap: 4800000000, week52High: 35.00, week52Low: 28.00, peRatio: 9.8 },
      
      // Construction & Allied
      { id: "BAMB", ticker: "BAMB", name: "Bamburi Cement", sector: "Construction", currentPrice: 42.50, previousClose: 43.25, dayHigh: 43.50, dayLow: 42.00, volume: 380000, marketCap: 25500000000, week52High: 48.00, week52Low: 38.00, peRatio: 14.2 },
      { id: "FIRE", ticker: "FIRE", name: "East African Cables", sector: "Construction", currentPrice: 2.18, previousClose: 2.20, dayHigh: 2.25, dayLow: 2.15, volume: 420000, marketCap: 872000000, week52High: 2.60, week52Low: 1.95, peRatio: null },
      { id: "ARMCM", ticker: "ARMCM", name: "ARM Cement", sector: "Construction", currentPrice: 1.85, previousClose: 1.90, dayHigh: 1.95, dayLow: 1.82, volume: 680000, marketCap: 740000000, week52High: 2.50, week52Low: 1.60, peRatio: null },
      
      // Energy & Petroleum
      { id: "KPLC", ticker: "KPLC", name: "Kenya Power & Lighting", sector: "Energy", currentPrice: 2.45, previousClose: 2.50, dayHigh: 2.55, dayLow: 2.42, volume: 4500000, marketCap: 4900000000, week52High: 3.20, week52Low: 2.10, peRatio: null },
      { id: "KEGN", ticker: "KEGN", name: "KenGen", sector: "Energy", currentPrice: 3.82, previousClose: 3.75, dayHigh: 3.88, dayLow: 3.76, volume: 2100000, marketCap: 38200000000, week52High: 4.50, week52Low: 3.20, peRatio: 8.5 },
      { id: "TOTL", ticker: "TOTL", name: "Total Energies Kenya", sector: "Energy", currentPrice: 18.50, previousClose: 18.25, dayHigh: 18.75, dayLow: 18.30, volume: 180000, marketCap: 7400000000, week52High: 20.00, week52Low: 16.50, peRatio: 10.2 },
      { id: "KENOL", ticker: "KENOL", name: "KenolKobil", sector: "Energy", currentPrice: 14.20, previousClose: 14.50, dayHigh: 14.65, dayLow: 14.10, volume: 220000, marketCap: 5680000000, week52High: 16.00, week52Low: 12.50, peRatio: 9.1 },
      
      // Insurance
      { id: "BRIT", ticker: "BRIT", name: "Britam Holdings", sector: "Insurance", currentPrice: 6.95, previousClose: 6.80, dayHigh: 7.05, dayLow: 6.85, volume: 1450000, marketCap: 13900000000, week52High: 8.00, week52Low: 5.80, peRatio: 11.6 },
      { id: "CIC", ticker: "CIC", name: "CIC Insurance Group", sector: "Insurance", currentPrice: 2.85, previousClose: 2.90, dayHigh: 2.95, dayLow: 2.82, volume: 950000, marketCap: 5700000000, week52High: 3.40, week52Low: 2.50, peRatio: 8.9 },
      { id: "JUBI", ticker: "JUBI", name: "Jubilee Holdings", sector: "Insurance", currentPrice: 285.00, previousClose: 290.00, dayHigh: 292.00, dayLow: 283.00, volume: 38000, marketCap: 22800000000, week52High: 320.00, week52Low: 265.00, peRatio: 7.4 },
      { id: "LIBERTY", ticker: "LIBERTY", name: "Liberty Holdings", sector: "Insurance", currentPrice: 9.40, previousClose: 9.25, dayHigh: 9.50, dayLow: 9.30, volume: 125000, marketCap: 3760000000, week52High: 10.50, week52Low: 8.00, peRatio: 10.8 },
      
      // Investment
      { id: "CENTUM", ticker: "CENTUM", name: "Centum Investment", sector: "Investment", currentPrice: 18.75, previousClose: 19.00, dayHigh: 19.20, dayLow: 18.60, volume: 420000, marketCap: 7500000000, week52High: 22.00, week52Low: 16.00, peRatio: null },
      { id: "OLYMP", ticker: "OLYMP", name: "Olympia Capital Holdings", sector: "Investment", currentPrice: 3.25, previousClose: 3.20, dayHigh: 3.30, dayLow: 3.18, volume: 180000, marketCap: 1300000000, week52High: 3.80, week52Low: 2.80, peRatio: 6.5 },
      { id: "BRITAM", ticker: "BRITAM", name: "Britam Asset Managers", sector: "Investment", currentPrice: 4.55, previousClose: 4.50, dayHigh: 4.62, dayLow: 4.48, volume: 95000, marketCap: 1820000000, week52High: 5.20, week52Low: 4.00, peRatio: 8.2 },
      
      // Automobile & Accessories
      { id: "CMC", ticker: "CMC", name: "CMC Holdings", sector: "Automobile", currentPrice: 6.80, previousClose: 7.00, dayHigh: 7.05, dayLow: 6.75, volume: 280000, marketCap: 2720000000, week52High: 8.50, week52Low: 6.00, peRatio: null },
      { id: "SAMEER", ticker: "SAMEER", name: "Sameer Africa", sector: "Automobile", currentPrice: 2.95, previousClose: 3.00, dayHigh: 3.05, dayLow: 2.90, volume: 150000, marketCap: 885000000, week52High: 3.60, week52Low: 2.50, peRatio: null },
      
      // Commercial & Services
      { id: "SCAN", ticker: "SCAN", name: "Scangroup", sector: "Commercial Services", currentPrice: 14.50, previousClose: 14.25, dayHigh: 14.70, dayLow: 14.30, volume: 85000, marketCap: 2900000000, week52High: 16.00, week52Low: 12.50, peRatio: 12.3 },
      { id: "NATION", ticker: "NATION", name: "Nation Media Group", sector: "Commercial Services", currentPrice: 18.20, previousClose: 18.50, dayHigh: 18.65, dayLow: 18.05, volume: 320000, marketCap: 7280000000, week52High: 22.00, week52Low: 16.00, peRatio: 9.8 },
      { id: "SKAN", ticker: "SKAN", name: "Longhorn Publishers", sector: "Commercial Services", currentPrice: 8.45, previousClose: 8.30, dayHigh: 8.55, dayLow: 8.35, volume: 65000, marketCap: 1690000000, week52High: 9.50, week52Low: 7.00, peRatio: 11.2 },
      { id: "TPS", ticker: "TPS", name: "TPS Eastern Africa (Serena)", sector: "Commercial Services", currentPrice: 15.80, previousClose: 16.00, dayHigh: 16.10, dayLow: 15.70, volume: 92000, marketCap: 6320000000, week52High: 18.00, week52Low: 14.00, peRatio: 13.5 },
      
      // Agricultural
      { id: "KAKUZI", ticker: "KAKUZI", name: "Kakuzi", sector: "Agricultural", currentPrice: 385.00, previousClose: 380.00, dayHigh: 388.00, dayLow: 382.00, volume: 12000, marketCap: 9240000000, week52High: 420.00, week52Low: 350.00, peRatio: 15.4 },
      { id: "SASINI", ticker: "SASINI", name: "Sasini", sector: "Agricultural", currentPrice: 22.50, previousClose: 22.00, dayHigh: 22.75, dayLow: 22.20, volume: 48000, marketCap: 4500000000, week52High: 25.00, week52Low: 19.00, peRatio: 12.8 },
      { id: "KAPC", ticker: "KAPC", name: "Kapchorua Tea", sector: "Agricultural", currentPrice: 42.00, previousClose: 41.50, dayHigh: 42.50, dayLow: 41.75, volume: 28000, marketCap: 3360000000, week52High: 46.00, week52Low: 38.00, peRatio: 14.1 },
      { id: "LIMT", ticker: "LIMT", name: "Limuru Tea", sector: "Agricultural", currentPrice: 285.00, previousClose: 280.00, dayHigh: 287.00, dayLow: 283.00, volume: 5500, marketCap: 2565000000, week52High: 310.00, week52Low: 260.00, peRatio: 16.2 },
      { id: "WILLIAMSON", ticker: "WTK", name: "Williamson Tea Kenya", sector: "Agricultural", currentPrice: 155.00, previousClose: 152.00, dayHigh: 157.00, dayLow: 153.50, volume: 8200, marketCap: 3100000000, week52High: 175.00, week52Low: 140.00, peRatio: 13.9 },
      
      // Real Estate Investment Trusts (REITs)
      { id: "ILAM", ticker: "ILAM", name: "Acorn I-REIT", currentPrice: 22.50, previousClose: 22.25, dayHigh: 22.70, dayLow: 22.30, volume: 125000, marketCap: 4500000000, week52High: 24.00, week52Low: 20.00, peRatio: 11.3, sector: "REIT" },
      { id: "FAHARI", ticker: "FAHARI", name: "Fahari I-REIT", sector: "REIT", currentPrice: 6.85, previousClose: 7.00, dayHigh: 7.05, dayLow: 6.80, volume: 95000, marketCap: 1370000000, week52High: 8.50, week52Low: 6.00, peRatio: 8.9 },
      
      // Growth Enterprise Market Segment (GEMS)
      { id: "HOME", ticker: "HOME", name: "Home Afrika", sector: "Real Estate", currentPrice: 1.25, previousClose: 1.28, dayHigh: 1.30, dayLow: 1.23, volume: 380000, marketCap: 500000000, week52High: 1.60, week52Low: 1.00, peRatio: null },
      { id: "KURWITU", ticker: "KURWITU", name: "Kurwitu Ventures", sector: "Investment", currentPrice: 3.50, previousClose: 3.45, dayHigh: 3.58, dayLow: 3.47, volume: 42000, marketCap: 700000000, week52High: 4.00, week52Low: 3.00, peRatio: null },
      
      // Additional Major Stocks
      { id: "STANLIB", ticker: "STANLIB", name: "Stanlib Fahari I-REIT", sector: "REIT", currentPrice: 5.40, previousClose: 5.50, dayHigh: 5.55, dayLow: 5.38, volume: 68000, marketCap: 1080000000, week52High: 6.20, week52Low: 4.80, peRatio: 9.4 },
      { id: "EVEREADY", ticker: "EVEREADY", name: "Eveready East Africa", sector: "Manufacturing", currentPrice: 0.95, previousClose: 1.00, dayHigh: 1.02, dayLow: 0.93, volume: 520000, marketCap: 380000000, week52High: 1.35, week52Low: 0.80, peRatio: null },
      { id: "EXPRESS", ticker: "EXPRESS", name: "Express Kenya", sector: "Commercial Services", currentPrice: 3.85, previousClose: 3.90, dayHigh: 3.95, dayLow: 3.82, volume: 145000, marketCap: 770000000, week52High: 4.50, week52Low: 3.20, peRatio: 10.5 },
      { id: "TRANS", ticker: "TRANS", name: "TransCentury", sector: "Investment", currentPrice: 2.40, previousClose: 2.45, dayHigh: 2.50, dayLow: 2.38, volume: 280000, marketCap: 960000000, week52High: 3.00, week52Low: 2.00, peRatio: null },
      { id: "UCHUMI", ticker: "UCHUMI", name: "Uchumi Supermarkets", sector: "Commercial Services", currentPrice: 0.38, previousClose: 0.40, dayHigh: 0.42, dayLow: 0.37, volume: 1200000, marketCap: 152000000, week52High: 0.65, week52Low: 0.30, peRatio: null },
      { id: "CROWN", ticker: "CROWN", name: "Crown Paints Kenya", sector: "Manufacturing", currentPrice: 28.50, previousClose: 28.00, dayHigh: 28.75, dayLow: 27.95, volume: 75000, marketCap: 5700000000, week52High: 32.00, week52Low: 25.00, peRatio: 11.8 },
      { id: "KENYA", ticker: "KENYA", name: "Kenya Airways", sector: "Automobile", currentPrice: 3.58, previousClose: 3.65, dayHigh: 3.70, dayLow: 3.55, volume: 1850000, marketCap: 1432000000, week52High: 4.50, week52Low: 2.80, peRatio: null },
    ];

    nseStocks.forEach(stock => {
      this.stocks.set(stock.id, { ...stock, lastUpdated: new Date() });
    });

    // Seed news data with IPOs and market news
    const newsItems: InsertNews[] = [
      {
        id: randomUUID(),
        title: "Kenya Pipeline Company IPO Set for March 2026, Expected to Raise KES 149 Billion",
        description: "The government plans to list Kenya Pipeline Company (KPC) on the Nairobi Securities Exchange, offering up to 65% stake. This will be Kenya's largest IPO since Safaricom in 2008.",
        source: "Kenyan Wall Street",
        category: "IPO",
        imageUrl: null,
        publishedAt: new Date("2024-11-20T10:30:00Z"),
        relatedStocks: ["SCOM"],
      },
      {
        id: randomUUID(),
        title: "NSE 20 Index Gains 2.3% on Strong Banking Sector Performance",
        description: "The Nairobi Securities Exchange's NSE 20 index recorded its biggest weekly gain in three months, driven by strong performances from banking stocks including Equity Group and KCB.",
        source: "Capital Business",
        category: "Market News",
        imageUrl: null,
        publishedAt: new Date("2024-11-22T14:15:00Z"),
        relatedStocks: ["EQTY", "KCB", "COOP"],
      },
      {
        id: randomUUID(),
        title: "Safaricom Reports 15% Growth in M-Pesa Revenue",
        description: "Safaricom's mobile money platform M-Pesa continues to drive growth, with transaction value increasing to KES 26 trillion. The telco also announced plans to expand its fiber network.",
        source: "Business Daily Africa",
        category: "Company News",
        imageUrl: null,
        publishedAt: new Date("2024-11-21T09:45:00Z"),
        relatedStocks: ["SCOM"],
      },
      {
        id: randomUUID(),
        title: "Government Privatization Plan Includes National Oil, Kenya Literature Bureau",
        description: "Following the Kenya Pipeline Company IPO announcement, the government has revealed plans to privatize National Oil Corporation, New Kenya Cooperative Creameries, Kenya Literature Bureau, and Rivatex East Africa.",
        source: "The Nation",
        category: "IPO",
        imageUrl: null,
        publishedAt: new Date("2024-11-19T16:20:00Z"),
        relatedStocks: [],
      },
      {
        id: randomUUID(),
        title: "Equity Group Expands to Ethiopia, Eyes DRC Market Entry",
        description: "Equity Group Holdings announced it has received approval to commence banking operations in Ethiopia and is in advanced negotiations for market entry into the Democratic Republic of Congo.",
        source: "Capital FM Business",
        category: "Company News",
        imageUrl: null,
        publishedAt: new Date("2024-11-18T11:30:00Z"),
        relatedStocks: ["EQTY"],
      },
      {
        id: randomUUID(),
        title: "East African Breweries Launches New Premium Beer Line",
        description: "EABL has introduced a new premium beer range targeting Kenya's growing middle class. The company reported a 12% increase in revenue for the first half of 2024.",
        source: "Business Today",
        category: "Company News",
        imageUrl: null,
        publishedAt: new Date("2024-11-17T13:00:00Z"),
        relatedStocks: ["EABL"],
      },
      {
        id: randomUUID(),
        title: "NSE Introduces New Trading Rules to Boost Market Liquidity",
        description: "The Nairobi Securities Exchange has announced new trading rules including extended trading hours and reduced minimum trade sizes to attract more retail investors and improve market liquidity.",
        source: "Kenyan Wall Street",
        category: "Market News",
        imageUrl: null,
        publishedAt: new Date("2024-11-16T08:45:00Z"),
        relatedStocks: [],
      },
      {
        id: randomUUID(),
        title: "Foreign Investors Increase Stakes in Kenyan Banking Stocks",
        description: "Foreign institutional investors have increased their holdings in Kenyan banking stocks by 18% in the past quarter, citing improved economic outlook and attractive valuations.",
        source: "African Markets",
        category: "Market News",
        imageUrl: null,
        publishedAt: new Date("2024-11-15T10:15:00Z"),
        relatedStocks: ["EQTY", "KCB", "COOP", "ABSA"],
      },
      {
        id: randomUUID(),
        title: "KenGen Secures $500M Financing for Renewable Energy Projects",
        description: "Kenya's largest power producer has secured financing from international development banks for new geothermal and wind energy projects, expected to add 400MW to the national grid.",
        source: "Energy Africa",
        category: "Company News",
        imageUrl: null,
        publishedAt: new Date("2024-11-14T15:30:00Z"),
        relatedStocks: ["KEGN"],
      },
      {
        id: randomUUID(),
        title: "Britam Holdings Reports Strong Growth in Bancassurance Partnerships",
        description: "Britam announced a 25% increase in premium income from its bancassurance partnerships, with plans to expand distribution channels across East Africa.",
        source: "Insurance News Kenya",
        category: "Company News",
        imageUrl: null,
        publishedAt: new Date("2024-11-13T12:00:00Z"),
        relatedStocks: ["BRIT"],
      },
    ];

    newsItems.forEach(news => {
      this.news.set(news.id, news);
    });
  }

  async getAllStocks(): Promise<StockWithChange[]> {
    const stocks = Array.from(this.stocks.values());
    return stocks.map(stock => {
      const change = stock.currentPrice - stock.previousClose;
      const changePercent = (change / stock.previousClose) * 100;
      return {
        ...stock,
        change,
        changePercent,
        isPositive: changePercent >= 0,
      };
    });
  }

  async getStockById(id: string): Promise<Stock | undefined> {
    return this.stocks.get(id);
  }

  async getWatchlist(): Promise<Watchlist[]> {
    return Array.from(this.watchlist.values());
  }

  async addToWatchlist(item: InsertWatchlist): Promise<Watchlist> {
    const id = randomUUID();
    const watchlistItem: Watchlist = {
      id,
      stockId: item.stockId,
      addedAt: new Date(),
    };
    this.watchlist.set(id, watchlistItem);
    return watchlistItem;
  }

  async removeFromWatchlist(id: string): Promise<void> {
    this.watchlist.delete(id);
  }

  async getAllNews(): Promise<News[]> {
    return Array.from(this.news.values()).sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );
  }
}

export const storage = new MemStorage();

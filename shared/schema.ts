import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Stock model for NSE-listed companies
export const stocks = pgTable("stocks", {
  id: varchar("id").primaryKey(),
  ticker: text("ticker").notNull().unique(),
  name: text("name").notNull(),
  sector: text("sector").notNull(),
  currentPrice: real("current_price").notNull(),
  previousClose: real("previous_close").notNull(),
  dayHigh: real("day_high").notNull(),
  dayLow: real("day_low").notNull(),
  volume: integer("volume").notNull(),
  marketCap: real("market_cap"),
  week52High: real("week_52_high"),
  week52Low: real("week_52_low"),
  peRatio: real("pe_ratio"),
  lastUpdated: timestamp("last_updated").notNull().default(sql`now()`),
});

// Watchlist for user-selected stocks
export const watchlist = pgTable("watchlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stockId: varchar("stock_id").notNull(),
  addedAt: timestamp("added_at").notNull().default(sql`now()`),
});

// News articles
export const news = pgTable("news", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  source: text("source").notNull(),
  category: text("category").notNull(), // "IPO", "Market News", "Company News"
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at").notNull(),
  relatedStocks: text("related_stocks").array(),
});

// Insert schemas
export const insertStockSchema = createInsertSchema(stocks).omit({
  lastUpdated: true,
});

export const insertWatchlistSchema = createInsertSchema(watchlist).omit({
  id: true,
  addedAt: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({});

// Types
export type InsertStock = z.infer<typeof insertStockSchema>;
export type Stock = typeof stocks.$inferSelect;

export type InsertWatchlist = z.infer<typeof insertWatchlistSchema>;
export type Watchlist = typeof watchlist.$inferSelect;

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;

// Helper types for frontend
export type StockWithChange = Stock & {
  change: number;
  changePercent: number;
  isPositive: boolean;
};

export type NewsWithRelated = News & {
  relatedStocksData?: Stock[];
};

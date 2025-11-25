import type { Express } from "express";
import { createServer, type Server } from "http";
import registerStockRoutes from "./stocks.js";
import registerWatchlistRoutes from "./watchlist.js";
import registerNewsRoutes from "./news.js";
import registerBrokerRoutes from "./brokers.js";

export default async function registerRoutes(app: Express): Promise<Server> {
  // Register all API routes
  registerStockRoutes(app);
  registerWatchlistRoutes(app);
  registerNewsRoutes(app);
  registerBrokerRoutes(app);

  const httpServer = createServer(app);

  return httpServer;
}

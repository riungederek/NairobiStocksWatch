import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerStockRoutes } from "./stocks";
import { registerWatchlistRoutes } from "./watchlist";
import { registerNewsRoutes } from "./news";
import { registerBrokerRoutes } from "./brokers";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register all API routes
  registerStockRoutes(app);
  registerWatchlistRoutes(app);
  registerNewsRoutes(app);
  registerBrokerRoutes(app);

  const httpServer = createServer(app);

  return httpServer;
}

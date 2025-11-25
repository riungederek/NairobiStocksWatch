import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "../server/storage";
import { insertWatchlistSchema, insertBrokerSchema } from "@shared/schema";
import { generateStockInsight, generateBrokerInsight } from "../server/ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all stocks with calculated changes
  app.get("/api/stocks", async (_req, res) => {
    try {
      const stocks = await storage.getAllStocks();
      res.json(stocks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stocks" });
    }
  });

  // Get stock by ID
  app.get("/api/stocks/:id", async (req, res) => {
    try {
      const stock = await storage.getStockById(req.params.id);
      if (!stock) {
        return res.status(404).json({ error: "Stock not found" });
      }
      res.json(stock);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stock" });
    }
  });

  // Get watchlist
  app.get("/api/watchlist", async (_req, res) => {
    try {
      const watchlist = await storage.getWatchlist();
      res.json(watchlist);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch watchlist" });
    }
  });

  // Add to watchlist
  app.post("/api/watchlist", async (req, res) => {
    try {
      const result = insertWatchlistSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error });
      }

      const watchlistItem = await storage.addToWatchlist(result.data);
      res.status(201).json(watchlistItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to add to watchlist" });
    }
  });

  // Remove from watchlist
  app.delete("/api/watchlist/:id", async (req, res) => {
    try {
      await storage.removeFromWatchlist(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from watchlist" });
    }
  });

  // Get all news
  app.get("/api/news", async (_req, res) => {
    try {
      const news = await storage.getAllNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  // Get all brokers
  app.get("/api/brokers", async (_req, res) => {
    try {
      const brokers = await storage.getAllBrokers();
      res.json(brokers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brokers" });
    }
  });

  // Get broker by ID
  app.get("/api/brokers/:id", async (req, res) => {
    try {
      const broker = await storage.getBrokerById(req.params.id);
      if (!broker) {
        res.status(404).json({ error: "Broker not found" });
        return;
      }
      res.json(broker);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch broker" });
    }
  });

  // Get broker investments
  app.get("/api/brokers/:id/investments", async (req, res) => {
    try {
      const investments = await storage.getBrokerInvestments(req.params.id);
      const stocks = await storage.getAllStocks();
      
      // Enrich investments with stock data
      const enrichedInvestments = investments.map(inv => ({
        ...inv,
        stockData: stocks.find(s => s.id === inv.stockId),
      }));
      
      res.json(enrichedInvestments.sort((a, b) => b.investmentAmount - a.investmentAmount));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch broker investments" });
    }
  });

  // Get AI insights for a stock
  app.get("/api/stocks/:id/insights", async (req, res) => {
    try {
      const stock = await storage.getStockById(req.params.id);
      if (!stock) {
        res.status(404).json({ error: "Stock not found" });
        return;
      }

      const allStocks = await storage.getAllStocks();
      const allNews = await storage.getAllNews();

      // Calculate market context
      const topGainer = allStocks.reduce((max, s) => 
        s.changePercent > max.changePercent ? s : max
      , allStocks[0]);

      const topLoser = allStocks.reduce((min, s) => 
        s.changePercent < min.changePercent ? s : min
      , allStocks[0]);

      const avgChange = allStocks.reduce((sum, s) => sum + s.changePercent, 0) / allStocks.length;

      // Get related news
      const relatedNews = allNews.filter(n => n.relatedStocks?.includes(stock.ticker));

      // Enhance stock with calculated values
      const stockWithChange = {
        ...stock,
        change: stock.currentPrice - stock.previousClose,
        changePercent: ((stock.currentPrice - stock.previousClose) / stock.previousClose) * 100,
        isPositive: stock.currentPrice >= stock.previousClose,
      };

      const insight = await generateStockInsight(stockWithChange, relatedNews, {
        topGainer,
        topLoser,
        avgChange,
      });

      res.json({ insight, relatedNews: relatedNews.slice(0, 3) });
    } catch (error) {
      console.error("Error generating stock insight:", error);
      res.status(500).json({ error: "Failed to generate stock insights" });
    }
  });

  // Get AI insights for a broker
  app.get("/api/brokers/:id/insights", async (req, res) => {
    try {
      const broker = await storage.getBrokerById(req.params.id);
      if (!broker) {
        res.status(404).json({ error: "Broker not found" });
        return;
      }

      const investments = await storage.getBrokerInvestments(req.params.id);
      const allStocks = await storage.getAllStocks();

      // Enrich investments with stock data
      const topHoldings = investments
        .map(inv => {
          const stock = allStocks.find(s => s.id === inv.stockId);
          if (!stock) return null;
          return {
            ticker: stock.ticker,
            percentageOfPortfolio: inv.percentageOfPortfolio,
            currentPrice: stock.currentPrice,
            changePercent: ((stock.currentPrice - stock.previousClose) / stock.previousClose) * 100,
          };
        })
        .filter(Boolean)
        .sort((a, b) => (b?.percentageOfPortfolio || 0) - (a?.percentageOfPortfolio || 0));

      const avgChange = allStocks.reduce((sum, s) => 
        sum + ((s.currentPrice - s.previousClose) / s.previousClose) * 100
      , 0) / allStocks.length;

      const insight = await generateBrokerInsight(broker, topHoldings as any, { avgChange });

      res.json({ insight, topHoldings: topHoldings.slice(0, 5) });
    } catch (error) {
      console.error("Error generating broker insight:", error);
      res.status(500).json({ error: "Failed to generate broker insights" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

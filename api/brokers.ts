import type { Express } from "express";
import { storage } from "../server/storage";
import { generateBrokerInsight } from "../server/ai";

export function registerBrokerRoutes(app: Express) {
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
}

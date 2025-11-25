import type { Express } from "express";
import { getStocks, getStockById, getNews } from "../server/storage";
import { generateStockInsight } from "../server/ai";

export function registerStockRoutes(app: Express) {
  // Get all stocks with calculated changes
  app.get("/api/stocks", async (_req, res) => {
    try {
      const stocks = await getStocks();
      res.json(stocks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stocks" });
    }
  });

  // Get stock by ID
  app.get("/api/stocks/:id", async (req, res) => {
    try {
      const stock = await getStockById(req.params.id);
      if (!stock) {
        return res.status(404).json({ error: "Stock not found" });
      }
      res.json(stock);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stock" });
    }
  });

  // Get AI insights for a stock
  app.get("/api/stocks/:id/insights", async (req, res) => {
    try {
      const stock = await getStockById(req.params.id);
      if (!stock) {
        res.status(404).json({ error: "Stock not found" });
        return;
      }

      const allStocks = await getStocks();
      const allNews = await getNews();

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
}

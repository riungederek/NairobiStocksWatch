import type { Express } from "express";
import { storage } from "../server/storage";
import { insertWatchlistSchema } from "@shared/schema";

export function registerWatchlistRoutes(app: Express) {
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
}

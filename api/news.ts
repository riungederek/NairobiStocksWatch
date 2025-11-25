import type { Express } from "express";
import { getNews } from "../server/storage";

export function registerNewsRoutes(app: Express) {
  // Get all news
  app.get("/api/news", async (_req, res) => {
    try {
      const news = await getNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });
}

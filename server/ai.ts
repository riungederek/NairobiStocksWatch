import OpenAI from "openai";
import type { Stock, StockWithChange, Broker, News } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateStockInsight(
  stock: StockWithChange,
  relatedNews: News[],
  marketContext: { topGainer: StockWithChange; topLoser: StockWithChange; avgChange: number }
): Promise<string> {
  const newsContext = relatedNews
    .slice(0, 3)
    .map(
      (n) =>
        `- ${n.title} (${new Date(n.publishedAt).toLocaleDateString()}): ${n.description}`
    )
    .join("\n");

  const prompt = `You are a financial analyst providing insights on NSE (Nairobi Stock Exchange) stocks. Analyze the following stock and provide actionable insights for an investor.

STOCK DATA:
- Ticker: ${stock.ticker}
- Company: ${stock.name}
- Sector: ${stock.sector}
- Current Price: KES ${stock.currentPrice.toFixed(2)}
- Previous Close: KES ${stock.previousClose.toFixed(2)}
- Today's Change: ${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%
- 52-Week High: KES ${stock.week52High?.toFixed(2) || 'N/A'}
- 52-Week Low: KES ${stock.week52Low?.toFixed(2) || 'N/A'}
- P/E Ratio: ${stock.peRatio?.toFixed(2) || 'N/A'}
- Market Cap: KES ${stock.marketCap?.toLocaleString() || 'N/A'}

MARKET CONTEXT:
- Top Gainer Today: ${marketContext.topGainer.ticker} (${marketContext.topGainer.changePercent >= 0 ? '+' : ''}${marketContext.topGainer.changePercent.toFixed(2)}%)
- Top Loser Today: ${marketContext.topLoser.ticker} (${marketContext.topLoser.changePercent.toFixed(2)}%)
- Average Market Change: ${marketContext.avgChange >= 0 ? '+' : ''}${marketContext.avgChange.toFixed(2)}%

RECENT NEWS:
${newsContext || 'No recent news available'}

Provide a brief analysis (2-3 sentences) that:
1. Explains the current market position and what's driving today's movement
2. Highlights any risks or opportunities based on the news and market conditions
3. Gives a clear recommendation: BUY, HOLD, or SELL with reasoning

Keep the response concise, professional, and data-driven.`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content:
          "You are a financial analyst for the Nairobi Stock Exchange. Provide concise, actionable insights based on market data and news.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_completion_tokens: 500,
  });

  return response.choices[0].message.content || "Unable to generate insights at this time.";
}

export async function generateBrokerInsight(
  broker: Broker,
  topHoldings: Array<{ ticker: string; percentageOfPortfolio: number; currentPrice: number; changePercent: number }>,
  marketContext: { avgChange: number }
): Promise<string> {
  const holdingsContext = topHoldings
    .slice(0, 5)
    .map(
      (h) =>
        `- ${h.ticker}: ${h.percentageOfPortfolio.toFixed(1)}% of portfolio (${h.changePercent >= 0 ? '+' : ''}${h.changePercent.toFixed(2)}% today)`
    )
    .join("\n");

  const prompt = `You are an investment analyst evaluating broker performance on the Nairobi Stock Exchange. Analyze the following broker's portfolio strategy and performance.

BROKER INFORMATION:
- Name: ${broker.name}
- Trading Volume: KES ${broker.tradingVolume.toFixed(1)}M
- Market Share: ${broker.marketShare.toFixed(2)}%
- Total Trades: ${broker.tradesCount.toLocaleString('en-KE')}
- Performance Change (YTD): ${broker.performanceChange >= 0 ? '+' : ''}${broker.performanceChange.toFixed(2)}%

TOP HOLDINGS:
${holdingsContext}

MARKET CONTEXT:
- Average Market Change: ${marketContext.avgChange >= 0 ? '+' : ''}${marketContext.avgChange.toFixed(2)}%

Provide a brief analysis (2-3 sentences) that:
1. Evaluates the broker's portfolio concentration and sector exposure
2. Assesses how the broker is performing relative to market conditions
3. Identifies whether this broker's investment strategy aligns with current market trends

Keep the response concise and professional.`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content:
          "You are an investment analyst for the Nairobi Stock Exchange. Provide concise analysis of broker performance and portfolio strategy.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_completion_tokens: 500,
  });

  return response.choices[0].message.content || "Unable to generate insights at this time.";
}

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import type { StockWithChange } from "@shared/schema";

interface MarketStatsProps {
  stocks: StockWithChange[];
}

export function MarketStats({ stocks }: MarketStatsProps) {
  if (stocks.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  const topGainer = stocks.reduce((max, stock) => 
    stock.changePercent > max.changePercent ? stock : max
  , stocks[0]);
  
  const topLoser = stocks.reduce((min, stock) => 
    stock.changePercent < min.changePercent ? stock : min
  , stocks[0]);

  const totalVolume = stocks.reduce((sum, stock) => sum + stock.volume, 0);

  const avgChange = stocks.reduce((sum, stock) => sum + stock.changePercent, 0) / stocks.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-md bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-sm text-muted-foreground">Top Gainer</h3>
        </div>
        <div className="space-y-1">
          <div className="font-bold text-2xl" data-testid="text-top-gainer-name">{topGainer.ticker}</div>
          <div className="flex items-center gap-2">
            <span className="text-primary font-semibold">+{topGainer.changePercent.toFixed(2)}%</span>
            <span className="text-sm text-muted-foreground">KES {topGainer.currentPrice.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-md bg-destructive/10">
            <TrendingDown className="h-5 w-5 text-destructive" />
          </div>
          <h3 className="font-semibold text-sm text-muted-foreground">Top Loser</h3>
        </div>
        <div className="space-y-1">
          <div className="font-bold text-2xl" data-testid="text-top-loser-name">{topLoser.ticker}</div>
          <div className="flex items-center gap-2">
            <span className="text-destructive font-semibold">{topLoser.changePercent.toFixed(2)}%</span>
            <span className="text-sm text-muted-foreground">KES {topLoser.currentPrice.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-md bg-accent">
            <Activity className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-sm text-muted-foreground">Market Overview</h3>
        </div>
        <div className="space-y-1">
          <div className="font-bold text-2xl" data-testid="text-market-volume">
            {(totalVolume / 1000000).toFixed(1)}M
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${avgChange >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
            </span>
            <span className="text-sm text-muted-foreground">Total Volume</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

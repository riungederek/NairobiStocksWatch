import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, TrendingDown } from "lucide-react";
import type { StockWithChange } from "@shared/schema";
import { Link } from "wouter";

interface StockCardProps {
  stock: StockWithChange;
  isInWatchlist?: boolean;
  onToggleWatchlist?: (stockId: string) => void;
}

export function StockCard({ stock, isInWatchlist, onToggleWatchlist }: StockCardProps) {
  const isPositive = stock.changePercent >= 0;

  return (
    <Link href={`/stock/${stock.id}`}>
      <Card 
        className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all"
        data-testid={`card-stock-${stock.id}`}
      >
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-xl mb-1 truncate" data-testid={`text-stock-name-${stock.id}`}>
              {stock.name}
            </h3>
            <p className="text-sm text-muted-foreground" data-testid={`text-stock-ticker-${stock.id}`}>
              {stock.ticker}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWatchlist?.(stock.id);
            }}
            data-testid={`button-watchlist-${stock.id}`}
            className="flex-shrink-0"
          >
            <Star className={`h-5 w-5 ${isInWatchlist ? 'fill-primary text-primary' : ''}`} />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-4xl font-bold mb-2" data-testid={`text-stock-price-${stock.id}`}>
              KES {stock.currentPrice.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={isPositive ? "default" : "destructive"}
                className="flex items-center gap-1"
                data-testid={`badge-stock-change-${stock.id}`}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </Badge>
              <span className={`text-sm font-medium ${isPositive ? 'text-primary' : 'text-destructive'}`}>
                {isPositive ? '+' : ''}{stock.change.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Volume</span>
              <span className="font-medium" data-testid={`text-stock-volume-${stock.id}`}>
                {stock.volume.toLocaleString('en-KE')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sector</span>
              <span className="font-medium">{stock.sector}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Header } from "@/components/header";
import { StockChart } from "@/components/stock-chart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "wouter";
import type { StockWithChange, Watchlist } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function StockDetail() {
  const [, params] = useRoute("/stock/:id");
  const stockId = params?.id;
  const { toast } = useToast();

  const { data: allStocks = [] } = useQuery<StockWithChange[]>({
    queryKey: ["/api/stocks"],
  });

  const { data: watchlist = [] } = useQuery<Watchlist[]>({
    queryKey: ["/api/watchlist"],
  });

  const stock = allStocks.find((s) => s.id === stockId);
  const isInWatchlist = watchlist.some((item) => item.stockId === stockId);

  const toggleWatchlistMutation = useMutation({
    mutationFn: async () => {
      if (!stockId) return;
      // Get the latest watchlist from query client to avoid stale closure
      const currentWatchlist = queryClient.getQueryData<Watchlist[]>(["/api/watchlist"]) || [];
      const currentlyInWatchlist = currentWatchlist.some((item) => item.stockId === stockId);
      
      if (currentlyInWatchlist) {
        const item = currentWatchlist.find((item) => item.stockId === stockId);
        return apiRequest("DELETE", `/api/watchlist/${item?.id}`);
      } else {
        return apiRequest("POST", "/api/watchlist", { stockId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update watchlist",
        variant: "destructive",
      });
    },
  });

  if (!stock) {
    return (
      <div className="min-h-screen bg-background">
        <Header stocks={allStocks} />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
          <div className="space-y-8">
            <Skeleton className="h-32" />
            <Skeleton className="h-96" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isPositive = stock.changePercent >= 0;

  return (
    <div className="min-h-screen bg-background">
      <Header stocks={allStocks} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <Card className="p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold" data-testid="text-stock-detail-name">
                    {stock.name}
                  </h1>
                  <Badge variant="secondary">{stock.ticker}</Badge>
                </div>
                <p className="text-muted-foreground">{stock.sector}</p>
              </div>

              <Button
                variant={isInWatchlist ? "default" : "outline"}
                size="lg"
                onClick={() => toggleWatchlistMutation.mutate()}
                disabled={toggleWatchlistMutation.isPending}
                data-testid="button-watchlist-toggle"
              >
                <Star className={`h-5 w-5 mr-2 ${isInWatchlist ? 'fill-current' : ''}`} />
                {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-6xl font-bold mb-3" data-testid="text-stock-detail-price">
                  KES {stock.currentPrice.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={isPositive ? "default" : "destructive"}
                    className="text-base px-4 py-2 flex items-center gap-2"
                  >
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </Badge>
                  <span className={`text-lg font-semibold ${isPositive ? 'text-primary' : 'text-destructive'}`}>
                    {isPositive ? '+' : ''}KES {stock.change.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">Today</span>
                </div>
              </div>
            </div>
          </Card>

          <StockChart currentPrice={stock.currentPrice} ticker={stock.ticker} />

          <div>
            <h2 className="text-2xl font-bold mb-6">Key Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Previous Close</div>
                <div className="text-2xl font-bold" data-testid="text-previous-close">
                  KES {stock.previousClose.toFixed(2)}
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Day Range</div>
                <div className="text-2xl font-bold" data-testid="text-day-range">
                  {stock.dayLow.toFixed(2)} - {stock.dayHigh.toFixed(2)}
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Volume</div>
                <div className="text-2xl font-bold" data-testid="text-volume">
                  {stock.volume.toLocaleString('en-KE')}
                </div>
              </Card>

              {stock.marketCap && (
                <Card className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">Market Cap</div>
                  <div className="text-2xl font-bold">
                    KES {(stock.marketCap / 1000000000).toFixed(2)}B
                  </div>
                </Card>
              )}

              {stock.week52High && stock.week52Low && (
                <Card className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">52 Week Range</div>
                  <div className="text-2xl font-bold">
                    {stock.week52Low.toFixed(2)} - {stock.week52High.toFixed(2)}
                  </div>
                </Card>
              )}

              {stock.peRatio && (
                <Card className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">P/E Ratio</div>
                  <div className="text-2xl font-bold">{stock.peRatio.toFixed(2)}</div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { MarketStats } from "@/components/market-stats";
import { StockCard } from "@/components/stock-card";
import { NewsCard } from "@/components/news-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Newspaper, Star } from "lucide-react";
import type { StockWithChange, News, Watchlist } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();

  const { data: stocks = [], isLoading: isLoadingStocks } = useQuery<StockWithChange[]>({
    queryKey: ["/api/stocks"],
  });

  const { data: watchlist = [], isLoading: isLoadingWatchlist } = useQuery<Watchlist[]>({
    queryKey: ["/api/watchlist"],
  });

  const { data: news = [], isLoading: isLoadingNews } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const toggleWatchlistMutation = useMutation({
    mutationFn: async (stockId: string) => {
      // Get the latest watchlist from query client to avoid stale closure
      const currentWatchlist = queryClient.getQueryData<Watchlist[]>(["/api/watchlist"]) || [];
      const isInWatchlist = currentWatchlist.some((item) => item.stockId === stockId);
      
      if (isInWatchlist) {
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

  const watchlistStockIds = new Set(watchlist.map((item) => item.stockId));
  const watchlistStocks = stocks.filter((stock) => watchlistStockIds.has(stock.id));
  const trendingStocks = [...stocks].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)).slice(0, 9);

  const isLoading = isLoadingStocks || isLoadingWatchlist || isLoadingNews;

  return (
    <div className="min-h-screen bg-background">
      <Header stocks={stocks} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Market Dashboard</h1>
          <p className="text-muted-foreground">
            Track Nairobi Stock Exchange stocks in real-time
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <MarketStats stocks={stocks} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Tabs defaultValue="trending" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="trending" data-testid="tab-trending">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Trending Stocks
                    </TabsTrigger>
                    <TabsTrigger value="watchlist" data-testid="tab-watchlist">
                      <Star className="h-4 w-4 mr-2" />
                      My Watchlist ({watchlistStocks.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="trending" className="space-y-6">
                    {trendingStocks.length === 0 ? (
                      <Card className="p-12 text-center">
                        <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold text-lg mb-2">No stocks available</h3>
                        <p className="text-muted-foreground">Check back later for trending stocks</p>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {trendingStocks.map((stock) => (
                          <StockCard
                            key={stock.id}
                            stock={stock}
                            isInWatchlist={watchlistStockIds.has(stock.id)}
                            onToggleWatchlist={(stockId) => toggleWatchlistMutation.mutate(stockId)}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="watchlist" className="space-y-6">
                    {watchlistStocks.length === 0 ? (
                      <Card className="p-12 text-center">
                        <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold text-lg mb-2">Your watchlist is empty</h3>
                        <p className="text-muted-foreground mb-6">
                          Start tracking stocks by clicking the star icon on any stock card
                        </p>
                        <Button onClick={() => document.querySelector<HTMLButtonElement>('[data-testid="tab-trending"]')?.click()}>
                          Browse Stocks
                        </Button>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {watchlistStocks.map((stock) => (
                          <StockCard
                            key={stock.id}
                            stock={stock}
                            isInWatchlist={true}
                            onToggleWatchlist={(stockId) => toggleWatchlistMutation.mutate(stockId)}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Newspaper className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Market News</h2>
                </div>

                {news.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Newspaper className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">No news available</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {news.slice(0, 6).map((article) => (
                      <NewsCard key={article.id} news={article} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

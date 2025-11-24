import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/header";
import { AIInsights } from "@/components/ai-insights";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { Broker, StockWithChange, BrokerInvestmentWithStock } from "@shared/schema";

interface EnrichedInvestment extends BrokerInvestmentWithStock {
  stockData?: StockWithChange;
}

interface InsightData {
  insight: string;
  topHoldings: Array<{
    ticker: string;
    percentageOfPortfolio: number;
    currentPrice: number;
    changePercent: number;
  }>;
}

export default function BrokerDetail() {
  const [location, setLocation] = useLocation();
  const brokerId = location.split("/").pop();

  const { data: stocks = [] } = useQuery<StockWithChange[]>({
    queryKey: ["/api/stocks"],
  });

  const { data: broker, isLoading: brokerLoading } = useQuery<Broker>({
    queryKey: [`/api/brokers/${brokerId}`],
    enabled: !!brokerId,
  });

  const { data: investments = [], isLoading: investmentsLoading } = useQuery<EnrichedInvestment[]>({
    queryKey: [`/api/brokers/${brokerId}/investments`],
    enabled: !!brokerId,
  });

  const { data: insightData, isLoading: insightLoading } = useQuery<InsightData>({
    queryKey: [`/api/brokers/${brokerId}/insights`],
    enabled: !!brokerId,
  });

  const isLoading = brokerLoading || investmentsLoading || insightLoading;

  const isPositive = broker?.performanceChange ?? 0 >= 0;

  // Prepare chart data
  const chartData = investments.slice(0, 8).map(inv => ({
    name: inv.stockData?.ticker || "Unknown",
    value: inv.investmentAmount,
    percentage: inv.percentageOfPortfolio,
  }));

  const pieData = investments.map(inv => ({
    name: inv.stockData?.ticker || "Unknown",
    value: inv.investmentAmount,
  }));

  const colors = ["#2563eb", "#7c3aed", "#db2777", "#059669", "#d97706", "#1f2937", "#0891b2", "#7c2d12"];

  return (
    <div className="min-h-screen bg-background">
      <Header stocks={stocks} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-32" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        ) : !broker ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Broker not found</p>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Broker Info Card */}
            <Card className="p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{broker.name}</h1>
                  <p className="text-muted-foreground mb-6">NSE Licensed Stock Broker</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Trading Volume</p>
                      <p className="text-xl font-semibold">{broker.tradingVolume.toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Market Share</p>
                      <p className="text-xl font-semibold">{broker.marketShare.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Trades</p>
                      <p className="text-xl font-semibold">{broker.tradesCount.toLocaleString('en-KE')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Performance</p>
                      <div className="flex items-center gap-1 text-xl font-semibold">
                        {isPositive ? (
                          <TrendingUp className="h-5 w-5 text-primary" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-destructive" />
                        )}
                        <span className={isPositive ? "text-primary" : "text-destructive"}>
                          {isPositive ? "+" : ""}{broker.performanceChange.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* AI Insights */}
            <AIInsights 
              insight={insightData?.insight || ""}
              isLoading={insightLoading}
            />

            {/* Investments Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-primary" />
                Portfolio Investments
              </h2>

              {investments.length === 0 ? (
                <Card className="p-8 text-center">
                  <Activity className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No investments data available</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Chart */}
                  <div className="lg:col-span-2">
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">Investment Distribution</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="name" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip
                            contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
                            formatter={(value) => `KES ${(value as number).toFixed(1)}M`}
                          />
                          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>

                  {/* Summary */}
                  <div className="space-y-4">
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">Portfolio Summary</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Invested</p>
                          <p className="text-2xl font-bold">
                            KES {investments.reduce((sum, inv) => sum + inv.investmentAmount, 0).toFixed(1)}M
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Positions</p>
                          <p className="text-2xl font-bold">{investments.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Largest Position</p>
                          <p className="text-lg font-semibold">
                            {investments[0]?.stockData?.ticker || "N/A"} ({investments[0]?.percentageOfPortfolio.toFixed(1)}%)
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Investments Table */}
            {investments.length > 0 && (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold">Investment</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold">% of Portfolio</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments.map((investment, idx) => (
                        <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold">{investment.stockData?.ticker}</p>
                              <p className="text-sm text-muted-foreground">{investment.stockData?.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            KES {investment.stockData?.currentPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-right font-semibold">
                            KES {investment.investmentAmount.toFixed(1)}M
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium">
                              {investment.percentageOfPortfolio.toFixed(1)}%
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className={`flex items-center justify-end gap-1 font-semibold ${
                              investment.stockData?.changePercent ?? 0 >= 0 ? "text-primary" : "text-destructive"
                            }`}>
                              {investment.stockData?.changePercent ?? 0 >= 0 ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              {investment.stockData?.changePercent ?? 0 >= 0 ? "+" : ""}
                              {(investment.stockData?.changePercent ?? 0).toFixed(2)}%
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

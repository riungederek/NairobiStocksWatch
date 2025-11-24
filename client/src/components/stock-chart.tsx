import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useState } from "react";

interface StockChartProps {
  currentPrice: number;
  ticker: string;
}

type TimeRange = "1D" | "5D" | "1M" | "3M" | "1Y";

export function StockChart({ currentPrice, ticker }: StockChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("1D");

  // Generate mock chart data based on time range
  const generateChartData = (range: TimeRange) => {
    const points: { [key in TimeRange]: number } = {
      "1D": 24,
      "5D": 5,
      "1M": 30,
      "3M": 90,
      "1Y": 365,
    };

    const count = points[range];
    const data = [];
    const volatility = currentPrice * 0.02; // 2% volatility

    for (let i = 0; i < count; i++) {
      const randomChange = (Math.random() - 0.5) * volatility;
      const price = currentPrice + randomChange * (count - i) / count;
      
      data.push({
        time: range === "1D" ? `${i}:00` : `Day ${i + 1}`,
        price: Number(price.toFixed(2)),
      });
    }

    return data;
  };

  const chartData = generateChartData(timeRange);
  const firstPrice = chartData[0]?.price || currentPrice;
  const lastPrice = chartData[chartData.length - 1]?.price || currentPrice;
  const isPositive = lastPrice >= firstPrice;

  const timeRanges: TimeRange[] = ["1D", "5D", "1M", "3M", "1Y"];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Price Chart</h2>
        <div className="flex gap-2 flex-wrap">
          {timeRanges.map((range) => (
            <Badge
              key={range}
              variant={timeRange === range ? "default" : "secondary"}
              className="cursor-pointer hover-elevate"
              onClick={() => setTimeRange(range)}
              data-testid={`button-timerange-${range}`}
            >
              {range}
            </Badge>
          ))}
        </div>
      </div>

      <div className="h-80 w-full" data-testid="chart-stock-price">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${ticker}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 42%)"} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isPositive ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 42%)"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 42%)"}
              strokeWidth={2}
              fill={`url(#gradient-${ticker})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

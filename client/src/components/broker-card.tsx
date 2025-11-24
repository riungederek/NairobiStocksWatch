import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { Broker } from "@shared/schema";

interface BrokerCardProps {
  broker: Broker;
  rank: number;
}

export function BrokerCard({ broker, rank }: BrokerCardProps) {
  const isPositive = broker.performanceChange >= 0;

  return (
    <Card className="p-4 sm:p-6 hover-elevate active-elevate-2 transition-all" data-testid={`card-broker-${broker.id}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg sm:text-2xl font-bold text-muted-foreground">#{rank}</span>
            <h3 className="font-semibold text-sm sm:text-base" data-testid={`text-broker-name-${broker.id}`}>
              {broker.name}
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {broker.marketShare.toFixed(2)}% Market
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-xs sm:text-sm text-muted-foreground">Trading Volume</span>
          <span className="font-bold text-sm sm:text-base" data-testid={`text-broker-volume-${broker.id}`}>
            {broker.tradingVolume.toFixed(1)}M
          </span>
        </div>

        <div className="flex justify-between items-end">
          <span className="text-xs sm:text-sm text-muted-foreground">Total Trades</span>
          <span className="font-medium text-sm" data-testid={`text-broker-trades-${broker.id}`}>
            {broker.tradesCount.toLocaleString('en-KE')}
          </span>
        </div>

        <div className="flex justify-between items-end pt-2 border-t">
          <span className="text-xs sm:text-sm text-muted-foreground">Performance</span>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-primary" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span className={`font-semibold text-sm ${isPositive ? 'text-primary' : 'text-destructive'}`}>
              {isPositive ? '+' : ''}{broker.performanceChange.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

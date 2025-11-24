import { useState, useEffect, useRef } from "react";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import type { StockWithChange } from "@shared/schema";
import { useLocation } from "wouter";

interface StockSearchProps {
  stocks: StockWithChange[];
}

export function StockSearch({ stocks }: StockSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredStocks = query.trim()
    ? stocks
        .filter(
          (stock) =>
            stock.name.toLowerCase().includes(query.toLowerCase()) ||
            stock.ticker.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 8)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStockSelect = (stockId: string) => {
    setQuery("");
    setIsOpen(false);
    setLocation(`/stock/${stockId}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search stocks..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-4"
          data-testid="input-stock-search"
        />
      </div>

      {isOpen && filteredStocks.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto">
          <div className="py-2">
            {filteredStocks.map((stock) => {
              const isPositive = stock.changePercent >= 0;
              return (
                <button
                  key={stock.id}
                  onClick={() => handleStockSelect(stock.id)}
                  className="w-full px-4 py-3 hover-elevate text-left flex items-center justify-between gap-4"
                  data-testid={`button-search-result-${stock.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{stock.name}</div>
                    <div className="text-sm text-muted-foreground">{stock.ticker}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-medium">
                      KES {stock.currentPrice.toFixed(2)}
                    </div>
                    <div className={`text-sm flex items-center gap-1 ${isPositive ? 'text-primary' : 'text-destructive'}`}>
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

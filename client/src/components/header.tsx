import { ThemeToggle } from "./theme-toggle";
import { StockSearch } from "./stock-search";
import { TrendingUp } from "lucide-react";
import { Link } from "wouter";
import type { StockWithChange } from "@shared/schema";

interface HeaderProps {
  stocks: StockWithChange[];
}

export function Header({ stocks }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-md -ml-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline">NSE Tracker</span>
          </Link>

          <div className="flex-1 max-w-2xl mx-4">
            <StockSearch stocks={stocks} />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

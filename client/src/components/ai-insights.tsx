import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, AlertCircle } from "lucide-react";
import type { News } from "@shared/schema";

interface AIInsightsProps {
  insight: string;
  relatedNews?: News[];
  isLoading?: boolean;
}

export function AIInsights({ insight, relatedNews = [], isLoading = false }: AIInsightsProps) {
  return (
    <div className="space-y-4">
      <Card className="p-6 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <Sparkles className="h-6 w-6 text-primary mt-1" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              AI-Driven Market Insights
            </h3>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ) : (
              <p className="text-foreground leading-relaxed whitespace-pre-line">{insight}</p>
            )}
          </div>
        </div>
      </Card>

      {relatedNews && relatedNews.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            Related News & Headlines
          </h3>
          <div className="space-y-4">
            {relatedNews.map((news, idx) => (
              <div key={idx} className="pb-4 border-b last:border-b-0 last:pb-0">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">{news.title}</p>
                    <p className="text-sm text-muted-foreground mb-2">{news.description}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span className="inline-block px-2 py-1 rounded-md bg-muted">
                        {news.category}
                      </span>
                      <span>
                        {new Date(news.publishedAt).toLocaleDateString('en-KE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span>{news.source}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

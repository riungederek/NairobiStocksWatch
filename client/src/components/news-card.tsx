import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Newspaper } from "lucide-react";
import type { News } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface NewsCardProps {
  news: News;
}

const categoryColors: Record<string, "default" | "destructive" | "secondary"> = {
  "IPO": "default",
  "Market News": "secondary",
  "Company News": "secondary",
};

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Card 
      className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all"
      data-testid={`card-news-${news.id}`}
    >
      <div className="flex gap-4">
        {news.imageUrl ? (
          <div className="w-32 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
              data-testid={`img-news-${news.id}`}
            />
          </div>
        ) : (
          <div className="w-32 h-24 flex-shrink-0 rounded-md bg-muted flex items-center justify-center">
            <Newspaper className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start gap-2 flex-wrap">
            <Badge variant={categoryColors[news.category] || "secondary"} className="flex-shrink-0">
              {news.category}
            </Badge>
          </div>

          <h3 className="font-semibold text-base line-clamp-2" data-testid={`text-news-title-${news.id}`}>
            {news.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-news-description-${news.id}`}>
            {news.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
            <span className="font-medium" data-testid={`text-news-source-${news.id}`}>{news.source}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

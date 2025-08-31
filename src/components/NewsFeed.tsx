import { useState, useMemo } from 'react';
import { NewsCard } from './NewsCard';
import { NewsArticle, NewsCategory } from '@/types/news';
import { Button } from '@/components/ui/button';
import { RefreshCw, BookmarkX } from 'lucide-react';

interface NewsFeedProps {
  articles: NewsArticle[];
  searchQuery: string;
  selectedCategory: NewsCategory;
  onToggleBookmark: (id: string) => void;
  showBookmarksOnly: boolean;
  onRefresh: () => void;
}

export const NewsFeed = ({ 
  articles, 
  searchQuery, 
  selectedCategory, 
  onToggleBookmark,
  showBookmarksOnly,
  onRefresh
}: NewsFeedProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredArticles = useMemo(() => {
    let filtered = articles;

    // Filter by bookmarks if showing bookmarks only
    if (showBookmarksOnly) {
      filtered = filtered.filter(article => article.isBookmarked);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query) ||
        article.source.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [articles, searchQuery, selectedCategory, showBookmarksOnly]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
    onRefresh();
    setIsRefreshing(false);
  };

  if (showBookmarksOnly && filteredArticles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <BookmarkX className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No bookmarked articles</h3>
        <p className="text-muted-foreground max-w-sm">
          Start bookmarking articles you want to read later by clicking the bookmark icon on any article.
        </p>
      </div>
    );
  }

  if (filteredArticles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No articles found</h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          Try adjusting your search query or category filter to find more articles.
        </p>
        <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {showBookmarksOnly ? 'Bookmarked Articles' : 
             selectedCategory === 'all' ? 'Latest News' : 
             `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} News`}
          </h2>
          <p className="text-sm text-muted-foreground">
            {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="hover:bg-primary/10"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </div>
    </div>
  );
};
import { useState, useMemo } from 'react';
import { Bookmark, Search, Calendar, ExternalLink, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsCard } from '@/components/NewsCard';
import { mockNewsData } from '@/data/mockNews';
import { useToast } from '@/hooks/use-toast';

export default function SavedArticles() {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // For demo purposes, show some bookmarked articles
  const [savedArticles, setSavedArticles] = useState(
    mockNewsData.filter((_, index) => index % 3 === 0).map(article => ({ ...article, isBookmarked: true }))
  );

  const filteredArticles = useMemo(() => {
    return savedArticles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [savedArticles, searchQuery]);

  const handleToggleBookmark = (articleId: string) => {
    setSavedArticles(prev => prev.filter(article => article.id !== articleId));
    toast({
      title: "Bookmark Removed",
      description: "Article removed from saved articles",
    });
  };

  const handleClearAll = () => {
    setSavedArticles([]);
    toast({
      title: "All Bookmarks Cleared",
      description: "All saved articles have been removed",
    });
  };

  const groupedByDate = useMemo(() => {
    const groups: { [key: string]: typeof savedArticles } = {};
    
    filteredArticles.forEach(article => {
      const date = new Date(article.publishedAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(article);
    });
    
    return Object.entries(groups).sort(([a], [b]) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [filteredArticles]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Bookmark className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Saved Articles</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Your bookmarked articles for later reading
          </p>
        </div>

        {/* Stats and Actions */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Your Reading List</CardTitle>
                <CardDescription>
                  {savedArticles.length} article{savedArticles.length !== 1 ? 's' : ''} saved
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-sm">
                  {savedArticles.length} saved
                </Badge>
                {savedArticles.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearAll}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {savedArticles.length === 0 ? (
          /* Empty State */
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Bookmark className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Saved Articles
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Start bookmarking articles from the news feed to build your reading list. 
                Click the bookmark icon on any article to save it here.
              </p>
              <Button asChild>
                <a href="/">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Browse News Feed
                </a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search your saved articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtered Results Info */}
            {searchQuery && (
              <div className="mb-4 text-sm text-muted-foreground">
                {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
                {searchQuery && ` for "${searchQuery}"`}
              </div>
            )}

            {/* Articles Grouped by Date */}
            {filteredArticles.length === 0 && searchQuery ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No Results Found
                  </h3>
                  <p className="text-muted-foreground">
                    No saved articles match your search for "{searchQuery}"
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {groupedByDate.map(([date, articles]) => (
                  <div key={date}>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <h2 className="text-lg font-medium text-foreground">
                        {date === new Date().toDateString() ? 'Today' : 
                         date === new Date(Date.now() - 86400000).toDateString() ? 'Yesterday' :
                         date}
                      </h2>
                      <Badge variant="outline" className="text-xs">
                        {articles.length} article{articles.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <div className="grid gap-6 md:gap-8">
                      {articles.map((article) => (
                        <NewsCard
                          key={article.id}
                          article={article}
                          onToggleBookmark={handleToggleBookmark}
                          onUpdateSummary={() => {}}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
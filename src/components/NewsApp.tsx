import { useState, useCallback } from 'react';
import { SearchHeader } from './SearchHeader';
import { CategoryFilter } from './CategoryFilter';
import { NewsFeed } from './NewsFeed';
import { NewsArticle, NewsCategory } from '@/types/news';
import { mockNewsData } from '@/data/mockNews';
import heroImage from '@/assets/news-hero.jpg';

export const NewsApp = () => {
  const [articles, setArticles] = useState<NewsArticle[]>(mockNewsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('all');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const handleToggleBookmark = useCallback((articleId: string) => {
    setArticles(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, isBookmarked: !article.isBookmarked }
          : article
      )
    );
  }, []);

  const handleShowBookmarks = useCallback(() => {
    setShowBookmarksOnly(!showBookmarksOnly);
    setSelectedCategory('all');
    setSearchQuery('');
  }, [showBookmarksOnly]);

  const handleRefresh = useCallback(() => {
    // In a real app, this would fetch fresh data from an API
    setArticles([...mockNewsData]);
  }, []);

  const bookmarkCount = articles.filter(article => article.isBookmarked).length;

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onShowBookmarks={handleShowBookmarks}
        bookmarkCount={bookmarkCount}
      />

      {/* Hero Section */}
      {!searchQuery && selectedCategory === 'all' && !showBookmarksOnly && (
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={heroImage}
            alt="News aggregation platform"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Stay Informed, Stay Connected
              </h2>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl">
                Your personalized news hub aggregating stories from trusted sources across India and the world
              </p>
            </div>
          </div>
        </div>
      )}

      {!showBookmarksOnly && (
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      )}

      <NewsFeed
        articles={articles}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onToggleBookmark={handleToggleBookmark}
        showBookmarksOnly={showBookmarksOnly}
        onRefresh={handleRefresh}
      />
    </div>
  );
};
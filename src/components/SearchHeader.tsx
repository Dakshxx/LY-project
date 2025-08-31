import { useState } from 'react';
import { Search, X, Menu, Bookmark } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onShowBookmarks: () => void;
  bookmarkCount: number;
}

export const SearchHeader = ({ 
  searchQuery, 
  onSearchChange, 
  onShowBookmarks,
  bookmarkCount 
}: SearchHeaderProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              NewsHub
            </h1>
            
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`pl-10 pr-10 transition-all duration-300 ${
                  isSearchFocused ? 'ring-2 ring-primary/20 shadow-lg' : ''
                }`}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-secondary"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onShowBookmarks}
            className="relative hover:bg-accent/10 hover:border-accent transition-all duration-300"
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Bookmarks
            {bookmarkCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {bookmarkCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
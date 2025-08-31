import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { NewsCategory, CategoryConfig } from '@/types/news';

interface CategoryFilterProps {
  selectedCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

const categories: CategoryConfig[] = [
  { id: 'all', label: 'All News', gradient: 'bg-primary', icon: '📰' },
  { id: 'politics', label: 'Politics', gradient: 'bg-gradient-politics', icon: '🏛️' },
  { id: 'sports', label: 'Sports', gradient: 'bg-gradient-sports', icon: '⚽' },
  { id: 'tech', label: 'Technology', gradient: 'bg-gradient-tech', icon: '💻' },
  { id: 'business', label: 'Business', gradient: 'bg-gradient-business', icon: '📈' },
  { id: 'entertainment', label: 'Entertainment', gradient: 'bg-gradient-entertainment', icon: '🎬' },
  { id: 'health', label: 'Health', gradient: 'bg-gradient-health', icon: '🏥' },
];

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-3 px-6 py-4">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={`
              whitespace-nowrap transition-all duration-300 hover:scale-105
              ${selectedCategory === category.id 
                ? `${category.gradient} text-white border-0 shadow-button` 
                : 'hover:bg-secondary'
              }
            `}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};
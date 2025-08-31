import { useState } from 'react';
import { Clock, Bookmark, BookmarkCheck, Volume2, VolumeX, Play, Pause, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { NewsArticle, AISummary } from '@/types/news';
import { useSpeech } from '@/hooks/useSpeech';
import { useToast } from '@/components/ui/use-toast';
import { SummaryGenerator } from './SummaryGenerator';

interface NewsCardProps {
  article: NewsArticle;
  onToggleBookmark: (id: string) => void;
  onUpdateSummary: (id: string, summary: AISummary) => void;
}

export const NewsCard = ({ article, onToggleBookmark, onUpdateSummary }: NewsCardProps) => {
  const { speak, stop, isSpeaking } = useSpeech();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSummaryGenerator, setShowSummaryGenerator] = useState(false);

  const handleReadAloud = () => {
    if (isSpeaking) {
      stop();
    } else {
      const textToRead = article.aiSummary?.medium || `${article.title}. ${article.summary}`;
      speak(textToRead);
    }
  };

  const handleBookmark = () => {
    onToggleBookmark(article.id);
    toast({
      title: article.isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: article.title,
      duration: 2000,
    });
  };

  const handleSummaryGenerated = (summary: AISummary) => {
    onUpdateSummary(article.id, summary);
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'politics': return 'bg-gradient-politics';
      case 'sports': return 'bg-gradient-sports';
      case 'tech': return 'bg-gradient-tech';
      case 'business': return 'bg-gradient-business';
      case 'entertainment': return 'bg-gradient-entertainment';
      case 'health': return 'bg-gradient-health';
      default: return 'bg-primary';
    }
  };

  return (
    <Card className="overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02] bg-card">
      {article.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge className={`${getCategoryStyles(article.category)} text-white border-0 px-3 py-1`}>
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </Badge>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSummaryGenerator(!showSummaryGenerator)}
              className={`text-muted-foreground hover:text-primary transition-colors ${
                article.aiSummary ? 'text-primary' : ''
              }`}
              title={article.aiSummary ? 'View AI Summary' : 'Generate AI Summary'}
            >
              <Sparkles className={`h-4 w-4 ${article.aiSummary ? 'text-primary' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReadAloud}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              {article.isBookmarked ? 
                <BookmarkCheck className="h-4 w-4 text-accent" /> : 
                <Bookmark className="h-4 w-4" />
              }
            </Button>
          </div>
        </div>

        <h3 className="text-xl font-bold text-card-foreground mb-3 leading-tight line-clamp-2">
          {article.title}
        </h3>

        {/* AI Summary or Original Summary */}
        {article.aiSummary && !showSummaryGenerator ? (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI Summary</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {article.aiSummary.medium}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {isExpanded ? article.summary : `${article.summary.slice(0, 150)}...`}
            {article.summary.length > 150 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary hover:underline ml-2 font-medium"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </p>
        )}

        {/* Summary Generator */}
        <Collapsible open={showSummaryGenerator} onOpenChange={setShowSummaryGenerator}>
          <CollapsibleContent>
            <div className="mb-4">
              <SummaryGenerator
                content={article.content}
                existingSummary={article.aiSummary}
                onSummaryGenerated={handleSummaryGenerated}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="font-medium">{article.source}</span>
            <span>by {article.author}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{article.readTime} min read</span>
          </div>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          {new Date(article.publishedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </Card>
  );
};
import { useState } from 'react';
import { Sparkles, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SummaryLength, AISummary } from '@/types/news';
import { Newssummarizer } from '@/utils/summarizer';
import { useToast } from '@/components/ui/use-toast';

interface SummaryGeneratorProps {
  content: string;
  existingSummary?: AISummary;
  onSummaryGenerated: (summary: AISummary) => void;
}

export const SummaryGenerator = ({ 
  content, 
  existingSummary, 
  onSummaryGenerated 
}: SummaryGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<AISummary | null>(existingSummary || null);
  const { toast } = useToast();

  const generateSummary = async () => {
    if (!content.trim()) return;

    setIsGenerating(true);
    try {
      // Generate all three summary lengths
      const [shortResult, mediumResult, detailedResult] = await Promise.all([
        Newssummarizer.simulateAISummarization(content, 'short'),
        Newssummarizer.simulateAISummarization(content, 'medium'),
        Newssummarizer.simulateAISummarization(content, 'detailed')
      ]);

      const aiSummary: AISummary = {
        short: shortResult.summary,
        medium: mediumResult.summary,
        detailed: detailedResult.summary,
        keyPoints: mediumResult.keyPoints,
        sentiment: mediumResult.sentiment,
        generatedAt: new Date().toISOString()
      };

      setCurrentSummary(aiSummary);
      onSummaryGenerated(aiSummary);

      toast({
        title: "AI Summary Generated",
        description: "Smart summaries are now available in multiple lengths",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI summary. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {!currentSummary ? (
        <div className="text-center py-6">
          <div className="mb-4">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-foreground">AI-Powered Summarization</h3>
            <p className="text-sm text-muted-foreground">
              Generate intelligent summaries with key insights and sentiment analysis
            </p>
          </div>
          
          <Button 
            onClick={generateSummary} 
            disabled={isGenerating}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-button"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Summary...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Summary
              </>
            )}
          </Button>
        </div>
      ) : (
        <Card className="p-6 bg-gradient-to-br from-background to-secondary/20 border-primary/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">AI Summary</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={`${getSentimentColor(currentSummary.sentiment)} border`}>
                {getSentimentIcon(currentSummary.sentiment)}
                <span className="ml-1 capitalize">{currentSummary.sentiment}</span>
              </Badge>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generateSummary}
                disabled={isGenerating}
                className="hover:bg-primary/10"
              >
                {isGenerating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Regenerate"
                )}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="medium" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="short" className="text-xs">
                Quick (30s)
              </TabsTrigger>
              <TabsTrigger value="medium" className="text-xs">
                Standard (1m)
              </TabsTrigger>
              <TabsTrigger value="detailed" className="text-xs">
                Detailed (2m)
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="short" className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentSummary.short}
              </p>
            </TabsContent>
            
            <TabsContent value="medium" className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentSummary.medium}
              </p>
            </TabsContent>
            
            <TabsContent value="detailed" className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentSummary.detailed}
              </p>
            </TabsContent>
          </Tabs>

          {currentSummary.keyPoints.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="text-sm font-semibold mb-3 text-foreground">Key Points</h4>
              <ul className="space-y-2">
                {currentSummary.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
            Generated {new Date(currentSummary.generatedAt).toLocaleString()}
          </div>
        </Card>
      )}
    </div>
  );
};
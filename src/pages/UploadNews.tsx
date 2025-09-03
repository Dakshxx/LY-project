import { useState } from 'react';
import { Upload, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SummaryGenerator } from '@/components/SummaryGenerator';
import { NewsCategory } from '@/types/news';
import { useToast } from '@/hooks/use-toast';

const categories: { value: NewsCategory; label: string }[] = [
  { value: 'politics', label: 'Politics' },
  { value: 'sports', label: 'Sports' },
  { value: 'tech', label: 'Technology' },
  { value: 'business', label: 'Business' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'health', label: 'Health' },
];

export default function UploadNews() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NewsCategory>('tech');
  const [source, setSource] = useState('');
  const [author, setAuthor] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast({
        title: "Missing Information",
        description: "Please fill in the title and content fields.",
        variant: "destructive",
      });
      return;
    }

    setShowSummary(true);
    toast({
      title: "Article Uploaded Successfully!",
      description: "Your article is ready for AI summarization.",
    });
  };

  const handleReset = () => {
    setTitle('');
    setContent('');
    setCategory('tech');
    setSource('');
    setAuthor('');
    setShowSummary(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Upload News Article</h1>
          <p className="text-muted-foreground text-lg">
            Share your news article and get AI-powered summaries instantly
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Article Details
              </CardTitle>
              <CardDescription>
                Fill in the information below to upload your news article
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Article Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter the article title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={(value: NewsCategory) => setCategory(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="source">Source</Label>
                    <Input
                      id="source"
                      placeholder="e.g., Times of India"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      placeholder="Author name"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Article Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Paste or type the full article content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    {content.length} characters • Estimated read time: {Math.max(1, Math.ceil(content.split(' ').length / 200))} min
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Article
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* AI Summary Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Summary
              </CardTitle>
              <CardDescription>
                {showSummary 
                  ? "Generate intelligent summaries of your uploaded article"
                  : "Upload an article to see AI-powered summaries"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showSummary && content ? (
                <SummaryGenerator
                  content={content}
                  onSummaryGenerated={(summary) => {
                    console.log('Summary generated:', summary);
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No Article Uploaded
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Fill in the article details and upload to see AI summaries
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Article Preview */}
        {title && content && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Article Preview</CardTitle>
              <CardDescription>How your article will appear</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="capitalize bg-accent px-2 py-1 rounded text-accent-foreground">
                    {category}
                  </span>
                  {source && <span>Source: {source}</span>}
                  {author && <span>By: {author}</span>}
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {content.substring(0, 300)}
                    {content.length > 300 && '...'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  source: string;
  author: string;
  publishedAt: string;
  imageUrl?: string;
  readTime: number;
  isBookmarked: boolean;
  aiSummary?: AISummary;
}

export interface AISummary {
  short: string;
  medium: string;
  detailed: string;
  keyPoints: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  generatedAt: string;
}

export type NewsCategory = 
  | 'politics' 
  | 'sports' 
  | 'tech' 
  | 'business' 
  | 'entertainment' 
  | 'health' 
  | 'all';

export interface CategoryConfig {
  id: NewsCategory;
  label: string;
  gradient: string;
  icon: string;
}

export type SummaryLength = 'short' | 'medium' | 'detailed';
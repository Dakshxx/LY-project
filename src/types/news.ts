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
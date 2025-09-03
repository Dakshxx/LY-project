// Real AI summarization using Hugging Face Transformers (browser-based)

export type SummaryLength = 'short' | 'medium' | 'detailed';

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  readTime: number;
}

// Cache for AI models to avoid reloading
let summarizer: any = null;
let sentimentAnalyzer: any = null;
let modelsLoaded = false;

export class Newssummarizer {
  // Initialize AI models (loads once and caches)
  private static async initializeModels(): Promise<void> {
    if (modelsLoaded) return;

    try {
      console.log('🤖 Loading AI models...');
      
      // Dynamic import to avoid build issues
      const { pipeline } = await import('@huggingface/transformers');
      
      // Load models with error handling
      try {
        summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
        console.log('✅ Summarization model loaded');
      } catch (error) {
        console.warn('⚠️  Summarization model failed to load:', error);
      }

      try {
        sentimentAnalyzer = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
        console.log('✅ Sentiment analysis model loaded');
      } catch (error) {
        console.warn('⚠️  Sentiment model failed to load:', error);
      }

      modelsLoaded = true;
      console.log('✅ AI models initialization completed!');
      
    } catch (error) {
      console.error('❌ Failed to load AI models:', error);
      modelsLoaded = true; // Mark as attempted to avoid infinite retries
    }
  }

  // AI-powered sentiment analysis with fallback
  private static async analyzeSentimentAI(text: string): Promise<'positive' | 'negative' | 'neutral'> {
    if (!sentimentAnalyzer) {
      return this.analyzeSentimentFallback(text);
    }

    try {
      const result = await sentimentAnalyzer(text.substring(0, 500));
      
      // Handle different return types safely
      let sentiment: any = result;
      if (Array.isArray(result)) {
        sentiment = result[0];
      }
      
      if (sentiment && typeof sentiment === 'object') {
        const label = sentiment.label?.toUpperCase();
        const score = sentiment.score || 0;
        
        if (label === 'POSITIVE' && score > 0.6) return 'positive';
        if (label === 'NEGATIVE' && score > 0.6) return 'negative';
      }
      
      return 'neutral';
    } catch (error) {
      console.warn('Sentiment analysis failed, using fallback:', error);
      return this.analyzeSentimentFallback(text);
    }
  }

  // Fallback sentiment analysis
  private static analyzeSentimentFallback(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['breakthrough', 'success', 'victory', 'growth', 'improvement', 'achievement', 'progress', 'excellent', 'outstanding', 'innovative', 'revolutionary'];
    const negativeWords = ['crisis', 'failure', 'decline', 'controversy', 'scandal', 'disaster', 'conflict', 'problem', 'issue', 'concern'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  // Enhanced key point extraction
  private static extractKeyPointsAI(text: string, summary: string): string[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const summaryWords = summary.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    
    const keyWords = [
      ...summaryWords,
      'announced', 'revealed', 'reported', 'confirmed', 'launched', 'developed', 
      'increased', 'decreased', 'major', 'significant', 'important', 'breakthrough', 
      'record', 'first', 'new', 'percent', 'million', 'billion'
    ];
    
    const scoredSentences = sentences.map(sentence => {
      const score = keyWords.reduce((acc, word) => {
        return acc + (sentence.toLowerCase().includes(word) ? 1 : 0);
      }, 0);
      return { sentence: sentence.trim(), score };
    });

    return scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .filter(item => item.score > 0)
      .map(item => item.sentence);
  }

  // AI-powered summarization with fallback
  private static async summarizeAI(content: string, length: SummaryLength): Promise<string> {
    if (!summarizer) {
      return this.summarizeFallback(content, length);
    }

    try {
      // Prepare text for the model
      const cleanText = content.replace(/\s+/g, ' ').trim();
      const maxInputLength = 1000;
      const inputText = cleanText.length > maxInputLength ? cleanText.substring(0, maxInputLength) + '...' : cleanText;

      // Set parameters based on desired length
      let maxLength: number, minLength: number;
      switch (length) {
        case 'short':
          maxLength = 50;
          minLength = 20;
          break;
        case 'medium':
          maxLength = 100;
          minLength = 40;
          break;
        case 'detailed':
          maxLength = 200;
          minLength = 80;
          break;
      }

      const result = await summarizer(inputText, {
        max_new_tokens: maxLength,
        min_new_tokens: minLength,
        do_sample: false,
      });

      // Handle different return types safely
      let summaryText = '';
      if (Array.isArray(result)) {
        summaryText = result[0]?.summary_text || result[0]?.generated_text || '';
      } else if (result && typeof result === 'object') {
        summaryText = result.summary_text || result.generated_text || '';
      }

      return summaryText || this.summarizeFallback(content, length);
      
    } catch (error) {
      console.warn('AI summarization failed, using fallback:', error);
      return this.summarizeFallback(content, length);
    }
  }

  // Fallback rule-based summarization
  private static summarizeFallback(content: string, length: SummaryLength): string {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    let targetSentences: number;
    switch (length) {
      case 'short': targetSentences = Math.min(2, sentences.length); break;
      case 'medium': targetSentences = Math.min(3, sentences.length); break;
      case 'detailed': targetSentences = Math.min(5, sentences.length); break;
    }

    const selectedSentences = sentences.slice(0, targetSentences).map(s => s.trim());
    return selectedSentences.join('. ') + (selectedSentences.length > 0 ? '.' : '');
  }

  private static calculateReadTime(text: string): number {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  // Main public method - Real AI with graceful fallbacks
  public static async simulateAISummarization(content: string, length: SummaryLength): Promise<SummaryResult> {
    console.log(`🚀 Starting AI summarization (${length})...`);
    
    try {
      // Initialize models if needed
      await this.initializeModels();
      
      // Run AI operations with fallbacks
      const [summary, sentiment] = await Promise.all([
        this.summarizeAI(content, length),
        this.analyzeSentimentAI(content)
      ]);

      // Extract key points using enhanced algorithm
      const keyPoints = this.extractKeyPointsAI(content, summary);
      const readTime = this.calculateReadTime(summary);

      console.log('✅ AI summarization completed!');
      
      return {
        summary,
        keyPoints,
        sentiment,
        readTime
      };
      
    } catch (error) {
      console.error('AI summarization error:', error);
      
      // Complete fallback to rule-based approach
      console.log('🔄 Using complete fallback summarization...');
      const summary = this.summarizeFallback(content, length);
      const sentiment = this.analyzeSentimentFallback(content);
      const keyPoints = this.extractKeyPointsAI(content, summary);
      const readTime = this.calculateReadTime(summary);

      return { summary, keyPoints, sentiment, readTime };
    }
  }
}
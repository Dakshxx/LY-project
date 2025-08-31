export type SummaryLength = 'short' | 'medium' | 'detailed';

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  readTime: number;
}

export class Newssummarizer {
  private static extractKeyPoints(text: string): string[] {
    // Simple algorithm to extract key sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const keyWords = ['announced', 'revealed', 'reported', 'confirmed', 'launched', 'developed', 'increased', 'decreased', 'major', 'significant', 'important', 'breakthrough', 'record', 'first', 'new'];
    
    const scoredSentences = sentences.map(sentence => {
      const score = keyWords.reduce((acc, word) => {
        return acc + (sentence.toLowerCase().includes(word) ? 1 : 0);
      }, 0);
      return { sentence: sentence.trim(), score };
    });

    return scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.sentence);
  }

  private static analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['breakthrough', 'success', 'victory', 'growth', 'improvement', 'achievement', 'progress', 'excellent', 'outstanding', 'innovative', 'revolutionary'];
    const negativeWords = ['crisis', 'failure', 'decline', 'controversy', 'scandal', 'disaster', 'conflict', 'problem', 'issue', 'concern'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private static calculateReadTime(text: string): number {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  public static summarize(content: string, length: SummaryLength = 'medium'): SummaryResult {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const keyPoints = this.extractKeyPoints(content);
    const sentiment = this.analyzeSentiment(content);
    
    let targetSentences: number;
    switch (length) {
      case 'short':
        targetSentences = Math.min(2, sentences.length);
        break;
      case 'medium':
        targetSentences = Math.min(4, sentences.length);
        break;
      case 'detailed':
        targetSentences = Math.min(6, sentences.length);
        break;
    }

    // Smart sentence selection based on position and keywords
    const selectedSentences: string[] = [];
    
    // Always include first sentence (usually contains main info)
    if (sentences.length > 0) {
      selectedSentences.push(sentences[0].trim());
    }
    
    // Add sentences with high keyword density
    const remainingSentences = sentences.slice(1);
    const scoredSentences = remainingSentences.map((sentence, index) => {
      const keywordScore = keyPoints.some(point => 
        sentence.toLowerCase().includes(point.toLowerCase().slice(0, 10))
      ) ? 2 : 0;
      const positionScore = remainingSentences.length - index; // Earlier sentences get higher score
      return { sentence: sentence.trim(), score: keywordScore + positionScore };
    });

    const additionalSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, targetSentences - 1)
      .map(item => item.sentence);

    selectedSentences.push(...additionalSentences);
    
    const summary = selectedSentences.join('. ') + '.';
    const readTime = this.calculateReadTime(summary);

    return {
      summary,
      keyPoints,
      sentiment,
      readTime
    };
  }

  public static async simulateAISummarization(content: string, length: SummaryLength): Promise<SummaryResult> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return this.summarize(content, length);
  }
}
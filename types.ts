
export interface SentimentDataPoint {
  id: string; // e.g., "Review 1"
  sentiment: number; // -1 for negative, 0 for neutral, 1 for positive
}

export interface WordCloudWord {
  text: string;
  value: number; // frequency
}

export interface AnalysisResult {
  summary: string;
  trendData: SentimentDataPoint[];
  praises: WordCloudWord[];
  complaints: WordCloudWord[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

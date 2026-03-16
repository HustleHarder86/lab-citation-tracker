export interface CitationResult {
  aiModel: string;
  query: string;
  cited: boolean;
  score: number; // 0-100
  sentiment: "positive" | "neutral" | "negative" | "not_mentioned";
  snippet: string | null;
  prominence: "primary" | "secondary" | "passing" | "none";
}

export interface EmailCapture {
  email: string;
  timestamp: string;
}

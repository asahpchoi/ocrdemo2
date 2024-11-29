export interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

export interface ChatResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AnalysisResult {
  description: string;
  isLoading: boolean;
  error?: string;
  startTime?: number;
  endTime?: number;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  verification?: {
    result: string;
    confidence: number;
  };
}
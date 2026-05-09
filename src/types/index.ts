export interface LogEntry {
  id: string;
  timestamp: Date;
  content: string;
  type: LogType;
  tags: string[];
  category: string;
  command?: string;
  output?: string;
  codeSnippet?: string;
  filePath?: string;
  project?: string;
  importance: number;
  metadata: Record<string, any>;
}

export type LogType = 
  | 'command' 
  | 'note' 
  | 'code' 
  | 'error' 
  | 'solution' 
  | 'reference' 
  | 'idea';

export interface SearchOptions {
  query: string;
  tags?: string[];
  category?: string;
  type?: LogType;
  project?: string;
  startDate?: Date;
  endDate?: Date;
  importance?: number;
  limit?: number;
}

export interface Config {
  database: {
    path: string;
  };
  ai: {
    enabled: boolean;
    provider?: 'openai' | 'anthropic' | 'local';
    apiKey?: string;
    model?: string;
  };
  capture: {
    autoCapture: boolean;
    captureCommands: boolean;
    captureOutput: boolean;
    maxOutputLength: number;
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    itemsPerPage: number;
    dateFormat: string;
  };
}

export interface TagSuggestion {
  tag: string;
  confidence: number;
}

export interface CategorySuggestion {
  category: string;
  confidence: number;
}

export interface DailySummary {
  date: string;
  totalEntries: number;
  categories: Record<string, number>;
  tags: Record<string, number>;
  highlights: LogEntry[];
}

import { randomBytes } from 'crypto';
import { LogEntry, LogType, TagSuggestion, CategorySuggestion } from '../types';

export function generateId(): string {
  return randomBytes(16).toString('hex');
}

export function formatDate(date: Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

export function detectLogType(content: string, command?: string): LogType {
  const lowerContent = content.toLowerCase();
  
  if (command) {
    if (content.includes('error') || content.includes('exception') || content.includes('fail')) {
      return 'error';
    }
    return 'command';
  }
  
  if (content.includes('```') || /^(const|let|var|function|class|import|export)/m.test(content)) {
    return 'code';
  }
  
  if (lowerContent.includes('solution') || lowerContent.includes('fix') || lowerContent.includes('resolved')) {
    return 'solution';
  }
  
  if (lowerContent.includes('idea') || lowerContent.includes('thought') || lowerContent.includes('consider')) {
    return 'idea';
  }
  
  if (lowerContent.includes('ref') || lowerContent.includes('http') || lowerContent.includes('docs')) {
    return 'reference';
  }
  
  return 'note';
}

export function suggestTags(content: string, type: LogType): TagSuggestion[] {
  const suggestions: TagSuggestion[] = [];
  const lowerContent = content.toLowerCase();
  
  const tagPatterns: Record<string, string[]> = {
    'javascript': ['javascript', 'js', 'node', 'npm', 'yarn'],
    'typescript': ['typescript', 'ts', 'type'],
    'python': ['python', 'py', 'pip'],
    'react': ['react', 'jsx', 'tsx', 'component'],
    'vue': ['vue', 'nuxt'],
    'angular': ['angular'],
    'database': ['sql', 'database', 'db', 'query', 'postgres', 'mysql', 'mongodb'],
    'api': ['api', 'rest', 'graphql', 'endpoint'],
    'docker': ['docker', 'container', 'image'],
    'git': ['git', 'commit', 'branch', 'merge'],
    'testing': ['test', 'jest', 'mocha', 'cypress', 'e2e'],
    'deployment': ['deploy', 'ci/cd', 'github actions', 'jenkins'],
    'frontend': ['css', 'html', 'ui', 'ux', 'design'],
    'backend': ['server', 'backend', 'api', 'microservice'],
    'security': ['auth', 'security', 'jwt', 'oauth', 'encrypt'],
    'performance': ['performance', 'optimize', 'cache', 'speed']
  };
  
  for (const [tag, patterns] of Object.entries(tagPatterns)) {
    const matchCount = patterns.filter(pattern => lowerContent.includes(pattern)).length;
    if (matchCount > 0) {
      suggestions.push({
        tag,
        confidence: Math.min(matchCount * 0.3 + 0.4, 0.95)
      });
    }
  }
  
  if (type === 'error') {
    suggestions.push({ tag: 'error', confidence: 0.9 });
    suggestions.push({ tag: 'debug', confidence: 0.7 });
  }
  
  if (type === 'solution') {
    suggestions.push({ tag: 'solution', confidence: 0.9 });
  }
  
  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
}

export function suggestCategory(content: string, type: LogType): CategorySuggestion[] {
  const suggestions: CategorySuggestion[] = [];
  const lowerContent = content.toLowerCase();
  
  const categories: Record<string, string[]> = {
    'development': ['code', 'programming', 'function', 'class', 'implement'],
    'debugging': ['error', 'bug', 'fix', 'debug', 'issue', 'exception'],
    'learning': ['learn', 'tutorial', 'docs', 'documentation', 'guide'],
    'architecture': ['design', 'architecture', 'pattern', 'structure', 'system'],
    'devops': ['deploy', 'docker', 'kubernetes', 'ci/cd', 'pipeline', 'server'],
    'database': ['database', 'sql', 'query', 'schema', 'migration'],
    'frontend': ['ui', 'ux', 'component', 'css', 'html', 'react', 'vue'],
    'backend': ['api', 'server', 'endpoint', 'service', 'backend'],
    'testing': ['test', 'spec', 'jest', 'cypress', 'e2e', 'unit test']
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    const matchCount = keywords.filter(keyword => lowerContent.includes(keyword)).length;
    if (matchCount > 0) {
      suggestions.push({
        category,
        confidence: Math.min(matchCount * 0.25 + 0.5, 0.95)
      });
    }
  }
  
  if (suggestions.length === 0) {
    suggestions.push({ category: 'general', confidence: 0.8 });
  }
  
  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

export function extractCodeSnippets(content: string): string[] {
  const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
  const inlineCodeRegex = /`([^`]+)`/g;
  
  const snippets: string[] = [];
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    snippets.push(match[1].trim());
  }
  
  while ((match = inlineCodeRegex.exec(content)) !== null) {
    if (match[1].length > 20) {
      snippets.push(match[1]);
    }
  }
  
  return snippets;
}

export function calculateImportance(entry: LogEntry): number {
  let score = 1;
  
  if (entry.type === 'error') score += 3;
  if (entry.type === 'solution') score += 2;
  if (entry.codeSnippet) score += 1;
  if (entry.tags.includes('important')) score += 2;
  if (entry.tags.includes('bug')) score += 2;
  
  const contentLength = entry.content.length;
  if (contentLength > 500) score += 1;
  if (contentLength > 1000) score += 1;
  
  return Math.min(score, 5);
}

export function groupByDate(entries: LogEntry[]): Map<string, LogEntry[]> {
  const groups = new Map<string, LogEntry[]>();
  
  entries.forEach(entry => {
    const dateKey = formatDate(entry.timestamp, 'YYYY-MM-DD');
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(entry);
  });
  
  return groups;
}

export function highlightSearchTerms(text: string, query: string): string {
  if (!query) return text;
  
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '\x1b[33m$1\x1b[0m');
}

export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatDate(date, 'YYYY-MM-DD');
}

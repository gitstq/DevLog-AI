import { Database } from '../core/Database';
import { LogEntry, LogType } from '../types';
import clipboardy from 'clipboardy';
import { detectLogType, suggestTags, suggestCategory, calculateImportance } from '../utils/helpers';
import { printSuccess, printError, printInfo } from '../utils/display';

interface CaptureOptions {
  type?: LogType;
  category?: string;
  project?: string;
  tags?: string;
  note?: string;
}

export async function captureCommand(options: CaptureOptions, db: Database): Promise<void> {
  try {
    const clipboardContent = await clipboardy.read();
    
    if (!clipboardContent || clipboardContent.trim().length === 0) {
      printError('Clipboard is empty');
      return;
    }

    printInfo(`Captured ${clipboardContent.length} characters from clipboard`);

    const content = options.note 
      ? `${options.note}\n\n${clipboardContent}` 
      : clipboardContent;

    const type = options.type || detectLogType(content);
    const tags = options.tags ? options.tags.split(',').map(t => t.trim()) : [];
    
    // Auto-suggest if not provided
    const suggestedTags = tags.length === 0 ? suggestTags(content, type).map(s => s.tag) : tags;
    const suggestedCategory = options.category || suggestCategory(content, type)[0].category;

    const entryData: Omit<LogEntry, 'id'> = {
      timestamp: new Date(),
      content,
      type,
      tags: suggestedTags,
      category: suggestedCategory,
      project: options.project,
      importance: 1,
      metadata: {
        source: 'clipboard',
        capturedAt: new Date().toISOString()
      }
    };

    entryData.importance = calculateImportance(entryData as LogEntry);

    const entry = await db.create(entryData);
    
    printSuccess(`Captured and saved with ID: ${entry.id}`);
    printInfo(`Type: ${entry.type} | Category: ${entry.category}`);
    
    if (suggestedTags.length > 0 && !options.tags) {
      printInfo(`Auto-tagged: ${suggestedTags.join(', ')}`);
    }

  } catch (error) {
    printError(`Failed to capture from clipboard: ${error}`);
  }
}

import { Database } from '../core/Database';
import { printSuccess, printError, printInfo } from '../utils/display';
import fs from 'fs';
import path from 'path';

interface ExportOptions {
  format?: 'json' | 'markdown' | 'csv';
  output?: string;
}

export async function exportCommand(options: ExportOptions, db: Database): Promise<void> {
  try {
    const format = options.format || 'json';
    const entries = await db.getAll();
    
    let output: string;
    let extension: string;

    switch (format) {
      case 'json':
        output = JSON.stringify(entries, null, 2);
        extension = 'json';
        break;
      
      case 'markdown':
        output = entries.map(entry => {
          return `## ${entry.timestamp.toISOString()} - ${entry.type.toUpperCase()}\n\n` +
                 `**Category:** ${entry.category}\n\n` +
                 `**Tags:** ${entry.tags.join(', ')}\n\n` +
                 `${entry.content}\n\n` +
                 (entry.codeSnippet ? `\`\`\`\n${entry.codeSnippet}\n\`\`\`\n\n` : '') +
                 `---\n`;
        }).join('\n');
        extension = 'md';
        break;
      
      case 'csv':
        const headers = ['id', 'timestamp', 'type', 'category', 'tags', 'content', 'project'];
        const rows = entries.map(e => [
          e.id,
          e.timestamp.toISOString(),
          e.type,
          e.category,
          e.tags.join(';'),
          `"${e.content.replace(/"/g, '""')}"`,
          e.project || ''
        ]);
        output = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        extension = 'csv';
        break;
      
      default:
        printError(`Unsupported format: ${format}`);
        return;
    }

    const outputPath = options.output || `devlog-export-${new Date().toISOString().split('T')[0]}.${extension}`;
    const resolvedPath = path.resolve(outputPath);
    
    fs.writeFileSync(resolvedPath, output);
    
    printSuccess(`Exported ${entries.length} entries to ${resolvedPath}`);
    printInfo(`Format: ${format.toUpperCase()}`);
    
  } catch (error) {
    printError(`Failed to export entries: ${error}`);
  }
}

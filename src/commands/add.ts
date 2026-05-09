import { Database } from '../core/Database';
import { LogEntry, LogType } from '../types';
import { 
  detectLogType, 
  suggestTags, 
  suggestCategory, 
  extractCodeSnippets,
  calculateImportance 
} from '../utils/helpers';
import { printSuccess, printError, printInfo } from '../utils/display';
import inquirer from 'inquirer';

interface AddOptions {
  type?: LogType;
  tags?: string;
  category?: string;
  project?: string;
  command?: string;
  output?: string;
  file?: string;
  importance?: string;
  interactive?: boolean;
}

export async function addCommand(content: string, options: AddOptions, db: Database): Promise<void> {
  try {
    if (!content && !options.interactive) {
      printError('Please provide content or use --interactive mode');
      return;
    }

    let finalContent = content;
    let finalType = options.type;
    let finalTags = options.tags ? options.tags.split(',').map(t => t.trim()) : [];
    let finalCategory = options.category;
    let finalProject = options.project;
    let finalCommand = options.command;
    let finalOutput = options.output;
    let finalFilePath = options.file;
    let finalImportance = options.importance ? parseInt(options.importance) : 1;

    // Interactive mode
    if (options.interactive || !content) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'content',
          message: 'Enter your log content:',
          when: !content,
          validate: (input) => input.length > 0 || 'Content is required'
        },
        {
          type: 'list',
          name: 'type',
          message: 'Select log type:',
          choices: [
            { name: '📝 Note', value: 'note' },
            { name: '💻 Command', value: 'command' },
            { name: '💡 Code', value: 'code' },
            { name: '❌ Error', value: 'error' },
            { name: '✅ Solution', value: 'solution' },
            { name: '📚 Reference', value: 'reference' },
            { name: '💭 Idea', value: 'idea' }
          ],
          default: 'note'
        },
        {
          type: 'input',
          name: 'category',
          message: 'Category (e.g., development, debugging, learning):',
          default: 'general'
        },
        {
          type: 'input',
          name: 'project',
          message: 'Project name (optional):'
        },
        {
          type: 'input',
          name: 'tags',
          message: 'Tags (comma-separated, optional):'
        },
        {
          type: 'input',
          name: 'command',
          message: 'Related command (optional):',
          when: (answers) => answers.type === 'command' || answers.type === 'error'
        },
        {
          type: 'number',
          name: 'importance',
          message: 'Importance (1-5):',
          default: 1,
          validate: (input) => (input >= 1 && input <= 5) || 'Importance must be between 1 and 5'
        }
      ]);

      finalContent = content || answers.content;
      finalType = answers.type || options.type;
      finalCategory = answers.category || options.category;
      finalProject = answers.project || options.project;
      finalTags = answers.tags ? answers.tags.split(',').map((t: string) => t.trim()) : finalTags;
      finalCommand = answers.command || options.command;
      finalImportance = answers.importance || finalImportance;
    }

    // Auto-detect type if not specified
    if (!finalType) {
      finalType = detectLogType(finalContent, finalCommand);
      printInfo(`Auto-detected type: ${finalType}`);
    }

    // Extract code snippets
    const codeSnippets = extractCodeSnippets(finalContent);
    const codeSnippet = codeSnippets.length > 0 ? codeSnippets[0] : undefined;

    // Auto-suggest tags if not provided
    if (finalTags.length === 0) {
      const suggestions = suggestTags(finalContent, finalType);
      if (suggestions.length > 0) {
        finalTags = suggestions.map(s => s.tag);
        printInfo(`Auto-suggested tags: ${finalTags.join(', ')}`);
      }
    }

    // Auto-suggest category if not provided
    if (!finalCategory) {
      const suggestions = suggestCategory(finalContent, finalType);
      finalCategory = suggestions[0].category;
      printInfo(`Auto-suggested category: ${finalCategory}`);
    }

    const entryData: Omit<LogEntry, 'id'> = {
      timestamp: new Date(),
      content: finalContent,
      type: finalType,
      tags: finalTags,
      category: finalCategory,
      command: finalCommand,
      output: finalOutput,
      codeSnippet: codeSnippet,
      filePath: finalFilePath,
      project: finalProject,
      importance: finalImportance,
      metadata: {}
    };

    // Calculate importance
    entryData.importance = calculateImportance(entryData as LogEntry);

    const entry = await db.create(entryData);
    
    printSuccess(`Log entry created with ID: ${entry.id}`);
    printInfo(`Type: ${entry.type} | Category: ${entry.category} | Tags: ${entry.tags.join(', ')}`);
    
  } catch (error) {
    printError(`Failed to create log entry: ${error}`);
  }
}

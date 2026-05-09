import chalk from 'chalk';
import { LogEntry } from '../types';
import { formatDate, truncate, getRelativeTime, highlightSearchTerms } from './helpers';

export function printEntry(entry: LogEntry, options: { showFull?: boolean; highlightQuery?: string } = {}): void {
  const { showFull = false, highlightQuery = '' } = options;
  
  const typeColors: Record<string, chalk.Chalk> = {
    command: chalk.cyan,
    note: chalk.white,
    code: chalk.green,
    error: chalk.red,
    solution: chalk.yellow,
    reference: chalk.blue,
    idea: chalk.magenta
  };
  
  const typeColor = typeColors[entry.type] || chalk.white;
  const importanceIndicator = '★'.repeat(entry.importance) + '☆'.repeat(5 - entry.importance);
  
  console.log('\n' + chalk.gray('─'.repeat(80)));
  console.log(
    chalk.gray(`[${formatDate(entry.timestamp)}]`) + 
    ' ' + typeColor.bold(`[${entry.type.toUpperCase()}]`) +
    ' ' + chalk.yellow(importanceIndicator)
  );
  
  if (entry.project) {
    console.log(chalk.blue(`📁 Project: ${entry.project}`));
  }
  
  if (entry.category) {
    console.log(chalk.cyan(`🏷️  Category: ${entry.category}`));
  }
  
  if (entry.command) {
    console.log(chalk.gray('💻 Command:') + ' ' + chalk.cyan(entry.command));
  }
  
  console.log('\n' + chalk.white.bold('Content:'));
  let content = entry.content;
  if (highlightQuery) {
    content = highlightSearchTerms(content, highlightQuery);
  }
  
  if (showFull) {
    console.log(content);
  } else {
    console.log(truncate(content, 300));
  }
  
  if (entry.codeSnippet && showFull) {
    console.log('\n' + chalk.green.bold('Code Snippet:'));
    console.log(chalk.gray('```'));
    console.log(chalk.green(entry.codeSnippet));
    console.log(chalk.gray('```'));
  }
  
  if (entry.output && showFull) {
    console.log('\n' + chalk.gray.bold('Output:'));
    console.log(chalk.gray(truncate(entry.output, 500)));
  }
  
  if (entry.tags.length > 0) {
    console.log('\n' + chalk.magenta('Tags: ' + entry.tags.map(t => `#${t}`).join(' ')));
  }
  
  console.log(chalk.gray(`ID: ${entry.id}`));
}

export function printEntryList(entries: LogEntry[], options: { highlightQuery?: string } = {}): void {
  if (entries.length === 0) {
    console.log(chalk.yellow('No entries found.'));
    return;
  }
  
  console.log(chalk.blue(`\n📋 Found ${entries.length} entries\n`));
  
  entries.forEach((entry, index) => {
    const typeColors: Record<string, chalk.Chalk> = {
      command: chalk.cyan,
      note: chalk.white,
      code: chalk.green,
      error: chalk.red,
      solution: chalk.yellow,
      reference: chalk.blue,
      idea: chalk.magenta
    };
    
    const typeColor = typeColors[entry.type] || chalk.white;
    const timeStr = getRelativeTime(entry.timestamp);
    
    let content = truncate(entry.content, 60);
    if (options.highlightQuery) {
      content = highlightSearchTerms(content, options.highlightQuery);
    }
    
    console.log(
      chalk.gray(`${(index + 1).toString().padStart(3)}.`) +
      ' ' + typeColor(`[${entry.type.padEnd(9)}]`) +
      ' ' + chalk.gray(`(${timeStr})`) +
      ' ' + content
    );
    
    if (entry.tags.length > 0) {
      process.stdout.write(chalk.gray('     Tags: ') + chalk.magenta(entry.tags.slice(0, 3).map(t => `#${t}`).join(' ')));
      if (entry.tags.length > 3) {
        process.stdout.write(chalk.gray(` +${entry.tags.length - 3} more`));
      }
      console.log();
    }
  });
}

export function printStats(stats: {
  total: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
  byProject: Record<string, number>;
}): void {
  console.log(chalk.blue.bold('\n📊 DevLog Statistics\n'));
  
  console.log(chalk.white(`Total Entries: ${chalk.yellow(stats.total)}`));
  
  console.log(chalk.cyan('\n📁 By Category:'));
  Object.entries(stats.byCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      const bar = '█'.repeat(Math.min(count, 20));
      console.log(`  ${category.padEnd(15)} ${chalk.yellow(count.toString().padStart(4))} ${chalk.gray(bar)}`);
    });
  
  console.log(chalk.cyan('\n📝 By Type:'));
  Object.entries(stats.byType)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`  ${type.padEnd(15)} ${chalk.yellow(count)}`);
    });
  
  if (Object.keys(stats.byProject).length > 0) {
    console.log(chalk.cyan('\n🚀 By Project:'));
    Object.entries(stats.byProject)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([project, count]) => {
        console.log(`  ${project.padEnd(20)} ${chalk.yellow(count)}`);
      });
  }
}

export function printHelp(): void {
  console.log(chalk.blue.bold('\n🚀 DevLog AI - Developer Logging Assistant\n'));
  
  console.log(chalk.white('Usage:'));
  console.log('  devlog <command> [options]\n');
  
  console.log(chalk.cyan('Commands:'));
  console.log('  add, a          Add a new log entry');
  console.log('  list, ls        List recent entries');
  console.log('  search, s       Search entries');
  console.log('  view, v         View a specific entry');
  console.log('  edit, e         Edit an entry');
  console.log('  delete, d       Delete an entry');
  console.log('  stats           Show statistics');
  console.log('  capture, cap    Capture current clipboard');
  console.log('  export          Export entries to file');
  console.log('  import          Import entries from file');
  console.log('  config          Manage configuration');
  console.log('  help            Show this help message\n');
  
  console.log(chalk.cyan('Examples:'));
  console.log('  devlog add "Fixed the database connection issue" --tags "bug,postgres"');
  console.log('  devlog search "authentication" --type code');
  console.log('  devlog list --limit 20');
  console.log('  devlog capture --category "debugging"\n');
}

export function printSuccess(message: string): void {
  console.log(chalk.green('✓ ') + message);
}

export function printError(message: string): void {
  console.log(chalk.red('✗ ') + message);
}

export function printWarning(message: string): void {
  console.log(chalk.yellow('⚠ ') + message);
}

export function printInfo(message: string): void {
  console.log(chalk.blue('ℹ ') + message);
}

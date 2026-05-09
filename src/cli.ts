#!/usr/bin/env node

import { Command } from 'commander';
import { Database } from './core/Database';
import { addCommand } from './commands/add';
import { listCommand } from './commands/list';
import { searchCommand } from './commands/search';
import { viewCommand } from './commands/view';
import { statsCommand } from './commands/stats';
import { captureCommand } from './commands/capture';
import { deleteCommand } from './commands/delete';
import { exportCommand } from './commands/export';
import { printHelp, printError } from './utils/display';
import path from 'path';
import os from 'os';

const program = new Command();
const dbPath = path.join(os.homedir(), '.devlog', 'devlog.db');
const db = new Database(dbPath);

program
  .name('devlog')
  .description('🚀 AI-powered developer logging assistant')
  .version('1.0.0');

program
  .command('add <content>')
  .alias('a')
  .description('Add a new log entry')
  .option('-t, --type <type>', 'Log type (command, note, code, error, solution, reference, idea)')
  .option('-T, --tags <tags>', 'Comma-separated tags')
  .option('-c, --category <category>', 'Category')
  .option('-p, --project <project>', 'Project name')
  .option('-C, --command <command>', 'Related command')
  .option('-o, --output <output>', 'Command output')
  .option('-f, --file <file>', 'Related file path')
  .option('-i, --importance <level>', 'Importance level (1-5)')
  .option('-I, --interactive', 'Interactive mode')
  .action(async (content, options) => {
    await addCommand(content, options, db);
  });

program
  .command('list')
  .alias('ls')
  .description('List recent entries')
  .option('-l, --limit <number>', 'Number of entries to show', '20')
  .option('-t, --type <type>', 'Filter by type')
  .option('-c, --category <category>', 'Filter by category')
  .option('-p, --project <project>', 'Filter by project')
  .option('-T, --tags <tags>', 'Filter by tags (comma-separated)')
  .option('-d, --days <days>', 'Show entries from last N days')
  .action(async (options) => {
    await listCommand(options, db);
  });

program
  .command('search <query>')
  .alias('s')
  .description('Search entries')
  .option('-t, --type <type>', 'Filter by type')
  .option('-c, --category <category>', 'Filter by category')
  .option('-p, --project <project>', 'Filter by project')
  .option('-T, --tags <tags>', 'Filter by tags')
  .option('--start-date <date>', 'Start date (YYYY-MM-DD)')
  .option('--end-date <date>', 'End date (YYYY-MM-DD)')
  .option('-i, --importance <level>', 'Minimum importance level')
  .option('-l, --limit <number>', 'Maximum results', '50')
  .action(async (query, options) => {
    await searchCommand(query, options, db);
  });

program
  .command('view <id>')
  .alias('v')
  .description('View a specific entry')
  .option('-f, --full', 'Show full content including code snippets')
  .action(async (id, options) => {
    await viewCommand(id, options, db);
  });

program
  .command('stats')
  .description('Show statistics')
  .action(async () => {
    await statsCommand(db);
  });

program
  .command('capture')
  .alias('cap')
  .description('Capture current clipboard content')
  .option('-t, --type <type>', 'Log type')
  .option('-c, --category <category>', 'Category')
  .option('-p, --project <project>', 'Project name')
  .option('-T, --tags <tags>', 'Comma-separated tags')
  .option('-n, --note <note>', 'Additional note')
  .action(async (options) => {
    await captureCommand(options, db);
  });

program
  .command('delete <id>')
  .alias('d')
  .description('Delete an entry')
  .option('-f, --force', 'Force deletion without confirmation')
  .action(async (id, options) => {
    await deleteCommand(id, db, options.force);
  });

program
  .command('export')
  .description('Export entries to file')
  .option('-f, --format <format>', 'Export format (json, markdown, csv)', 'json')
  .option('-o, --output <path>', 'Output file path')
  .action(async (options) => {
    await exportCommand(options, db);
  });

program
  .command('help')
  .description('Show detailed help')
  .action(() => {
    printHelp();
  });

program.on('command:*', () => {
  printError(`Unknown command: ${program.args.join(' ')}`);
  console.log('Run "devlog --help" for available commands');
  process.exit(1);
});

if (process.argv.length === 2) {
  printHelp();
}

program.parse(process.argv);

process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  db.close();
  process.exit(0);
});

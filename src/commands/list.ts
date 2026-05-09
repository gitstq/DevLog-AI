import { Database } from '../core/Database';
import { printEntryList, printError, printInfo } from '../utils/display';

interface ListOptions {
  limit?: string;
  type?: string;
  category?: string;
  project?: string;
  tags?: string;
  days?: string;
}

export async function listCommand(options: ListOptions, db: Database): Promise<void> {
  try {
    const limit = options.limit ? parseInt(options.limit) : 20;
    
    let entries;
    
    if (options.days) {
      const days = parseInt(options.days);
      entries = await db.getRecent(days);
      printInfo(`Showing entries from the last ${days} days`);
    } else {
      entries = await db.getAll(limit);
    }
    
    // Filter by type
    if (options.type) {
      entries = entries.filter(e => e.type === options.type);
    }
    
    // Filter by category
    if (options.category) {
      entries = entries.filter(e => e.category === options.category);
    }
    
    // Filter by project
    if (options.project) {
      entries = entries.filter(e => e.project === options.project);
    }
    
    // Filter by tags
    if (options.tags) {
      const filterTags = options.tags.split(',').map(t => t.trim().toLowerCase());
      entries = entries.filter(e => 
        filterTags.some(tag => e.tags.some(et => et.toLowerCase().includes(tag)))
      );
    }
    
    printEntryList(entries);
    
  } catch (error) {
    printError(`Failed to list entries: ${error}`);
  }
}

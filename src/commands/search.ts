import { Database } from '../core/Database';
import { SearchOptions } from '../types';
import { printEntryList, printError, printInfo } from '../utils/display';

interface SearchCommandOptions {
  type?: string;
  category?: string;
  project?: string;
  tags?: string;
  startDate?: string;
  endDate?: string;
  importance?: string;
  limit?: string;
}

export async function searchCommand(query: string, options: SearchCommandOptions, db: Database): Promise<void> {
  try {
    const searchOptions: SearchOptions = {
      query: query || '',
      limit: options.limit ? parseInt(options.limit) : 50
    };

    if (options.type) {
      searchOptions.type = options.type as any;
    }

    if (options.category) {
      searchOptions.category = options.category;
    }

    if (options.project) {
      searchOptions.project = options.project;
    }

    if (options.startDate) {
      searchOptions.startDate = new Date(options.startDate);
    }

    if (options.endDate) {
      searchOptions.endDate = new Date(options.endDate);
    }

    if (options.importance) {
      searchOptions.importance = parseInt(options.importance);
    }

    const entries = await db.search(searchOptions);

    if (entries.length === 0) {
      printInfo('No entries found matching your search criteria.');
      return;
    }

    printEntryList(entries, { highlightQuery: query });

  } catch (error) {
    printError(`Failed to search entries: ${error}`);
  }
}

import { Database } from '../core/Database';
import { printEntry, printError } from '../utils/display';

interface ViewOptions {
  full?: boolean;
}

export async function viewCommand(id: string, options: ViewOptions, db: Database): Promise<void> {
  try {
    const entry = await db.findById(id);
    
    if (!entry) {
      // Try to find by index if numeric
      const index = parseInt(id);
      if (!isNaN(index) && index > 0) {
        const allEntries = await db.getAll(index);
        if (allEntries.length >= index) {
          printEntry(allEntries[index - 1], { showFull: options.full });
          return;
        }
      }
      printError(`Entry not found: ${id}`);
      return;
    }
    
    printEntry(entry, { showFull: options.full });
    
  } catch (error) {
    printError(`Failed to view entry: ${error}`);
  }
}

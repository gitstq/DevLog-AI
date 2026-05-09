import { Database } from '../core/Database';
import { printStats, printError } from '../utils/display';

export async function statsCommand(db: Database): Promise<void> {
  try {
    const stats = await db.getStats();
    printStats(stats);
  } catch (error) {
    printError(`Failed to get statistics: ${error}`);
  }
}

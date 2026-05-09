import { Database } from '../core/Database';
import { printSuccess, printError, printWarning } from '../utils/display';
import inquirer from 'inquirer';

export async function deleteCommand(id: string, db: Database, force: boolean = false): Promise<void> {
  try {
    const entry = await db.findById(id);
    
    if (!entry) {
      printError(`Entry not found: ${id}`);
      return;
    }

    if (!force) {
      const { confirm } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to delete this entry?\n  "${entry.content.substring(0, 100)}..."`,
        default: false
      }]);

      if (!confirm) {
        printWarning('Deletion cancelled');
        return;
      }
    }

    const deleted = await db.delete(id);
    
    if (deleted) {
      printSuccess(`Entry ${id} deleted successfully`);
    } else {
      printError(`Failed to delete entry ${id}`);
    }
  } catch (error) {
    printError(`Failed to delete entry: ${error}`);
  }
}

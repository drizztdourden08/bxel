/* @layer renderer-app @kind logic */
import type { MenuNode } from '@drizztdourden08/tessera';
import { roleFolderNode } from './role-folder-node';
import { roleReporter } from './role-reporter';
import { rolesOfFolder } from './roles-of-folder';

const roleFolderMenuNode = (folderPath: string): MenuNode => roleFolderNode({ folderPath, current: rolesOfFolder(folderPath), report: roleReporter(folderPath) });

export { roleFolderMenuNode };

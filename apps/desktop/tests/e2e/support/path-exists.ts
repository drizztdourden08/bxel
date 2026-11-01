/* @layer renderer-app @kind logic */
import { access } from 'node:fs/promises';

const pathExists = (path: string): Promise<boolean> => access(path).then(() => true, () => false);

export { pathExists };

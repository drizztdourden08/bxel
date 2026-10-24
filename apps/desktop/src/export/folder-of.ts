/* @layer renderer-app @kind logic */
import { FOLDER_TAIL } from './export.constants';

const folderOf = (path: string): string => path.replace(FOLDER_TAIL, '');

export { folderOf };

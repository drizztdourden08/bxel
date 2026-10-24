/* @layer renderer-app @kind logic */
import { fileName } from '../../../files/file-name';

const folderNameOf = (folder: string): string => fileName(folder.replace(/[\\/]+$/, ''));

export { folderNameOf };

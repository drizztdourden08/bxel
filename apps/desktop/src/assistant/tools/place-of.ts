/* @layer renderer-app @kind logic */
import { inFolder } from './in-folder';
import { recentIdOf } from './recent-id-of';

const placeOf = (path: string | undefined, folder: string): unknown => {
  if (path === undefined) return null;
  return inFolder(path, folder) ? { assistantFolder: true } : { recentId: recentIdOf(path) };
};

export { placeOf };

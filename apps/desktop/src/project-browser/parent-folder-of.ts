/* @layer renderer-app @kind logic */
import { parentOf } from '../workspace/parent-of';
import type { SourceRoot } from './project-browser.type';

const parentFolderOf = (roots: readonly SourceRoot[], folder: string | null): string | null => {
  if (folder === null || roots.some((root) => root.path.toLowerCase() === folder.toLowerCase())) return null;
  return parentOf(folder);
};

export { parentFolderOf };

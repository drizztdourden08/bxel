/* @layer renderer-app @kind logic */
import { KIND_LABEL } from '../asset-list/asset-list.constants';
import type { FileEntry } from './project-browser.type';

const summaryOf = (files: readonly FileEntry[]): string => {
  const counts = new Map<string, number>();
  for (const file of files) counts.set(KIND_LABEL[file.row.kind], (counts.get(KIND_LABEL[file.row.kind]) ?? 0) + 1);
  return [...counts].map(([kind, count]) => `${count} ${kind.toLowerCase()}${count === 1 ? '' : 's'}`).join(', ');
};

export { summaryOf };

/* @layer renderer-app @kind logic */
import { MOSAIC_LIMIT } from './project-browser.constants';
import type { FileEntry } from './project-browser.type';

const mosaicOf = (files: readonly FileEntry[], folder: string): readonly FileEntry[] => {
  const prefix = `${folder.toLowerCase()}/`;
  return files.filter((file) => file.row.path.toLowerCase().startsWith(prefix) && file.key !== null).slice(0, MOSAIC_LIMIT);
};

export { mosaicOf };

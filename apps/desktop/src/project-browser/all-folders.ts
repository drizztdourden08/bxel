/* @layer renderer-app @kind logic */
import type { AssetRow } from '../asset-list/asset-list.type';
import { parentOf } from '../workspace/parent-of';

const allFolders = (folders: readonly string[], rows: readonly AssetRow[]): readonly string[] => {
  const found = new Map<string, string>();
  for (const path of [...folders, ...rows.filter((row) => row.path !== '').map((row) => parentOf(row.path))]) found.set(path.toLowerCase(), path);
  return [...found.values()];
};

export { allFolders };

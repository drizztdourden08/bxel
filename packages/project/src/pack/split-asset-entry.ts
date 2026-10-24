/* @layer core @kind logic */
import { ASSETS_DIR } from '../container/project-container.constants';
import type { FolderId } from '../ids/id.type';
import { checkRelPath } from '../paths/check-rel-path';
import { isNativeAsset } from './is-native-asset';
import type { SplitEntry } from './split-asset-entry.type';

const splitAssetEntry = (entry: string, folderOfDir: ReadonlyMap<string, FolderId>): SplitEntry | undefined => {
  if (!entry.startsWith(ASSETS_DIR)) return undefined;
  const rest = entry.slice(ASSETS_DIR.length);
  const slash = rest.indexOf('/');
  const folderId = slash < 1 ? undefined : folderOfDir.get(rest.slice(0, slash));
  const path = rest.slice(slash + 1);
  return folderId !== undefined && isNativeAsset(path) && checkRelPath(path).ok ? { folderId, path } : undefined;
};

export { splitAssetEntry };

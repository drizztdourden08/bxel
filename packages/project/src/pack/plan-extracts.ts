/* @layer core @kind logic */
import type { FolderId } from '../ids/id.type';
import type { ExtractOperation, SkippedFile } from './pack.type';
import type { Extracts } from './plan-extracts.type';
import { splitAssetEntry } from './split-asset-entry';

const planExtracts = (
  entries: readonly string[],
  folderOfDir: ReadonlyMap<string, FolderId>,
  targets: ReadonlyMap<FolderId, string>,
): Extracts => {
  const extracts: ExtractOperation[] = [];
  const skipped: SkippedFile[] = [];
  for (const entry of [...entries].sort()) {
    const split = splitAssetEntry(entry, folderOfDir);
    const target = split === undefined ? undefined : targets.get(split.folderId);
    if (split === undefined || target === undefined) {
      skipped.push({ path: entry, reason: 'The entry is not a native asset of a project folder.' });
    } else {
      extracts.push({ kind: 'extract', entry, path: `${target}/${split.path}` });
    }
  }
  return { extracts, skipped };
};

export { planExtracts };

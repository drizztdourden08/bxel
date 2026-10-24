/* @layer core @kind logic */
import { ASSET_FORMAT } from '../model/asset-format.constants';
import { fileSafeStem } from './file-safe-stem';
import type { Placement, SplitEntry } from './split-plan.type';
import { SPLIT_FOLDER } from './split.constants';

const slot = (folder: string, fileName: string): string => `${folder}/${fileName}`.toLowerCase();

const placeEntry = (entry: SplitEntry, taken: Set<string>): Placement => {
  const { kind } = entry.key;
  const stem = fileSafeStem(entry.name, kind);
  const extension = ASSET_FORMAT[kind].extension;
  const folder = SPLIT_FOLDER[kind];
  const baseName = `${stem}${extension}`;
  let suffix = 0;
  let fileName = baseName;
  while (taken.has(slot(folder, fileName))) {
    suffix = suffix === 0 ? 2 : suffix + 1;
    fileName = `${stem} ${suffix}${extension}`;
  }
  taken.add(slot(folder, fileName));
  return { entry, folder, fileName, baseName, path: `${folder}/${fileName}`, suffix, renamed: stem !== entry.name };
};

export { placeEntry };

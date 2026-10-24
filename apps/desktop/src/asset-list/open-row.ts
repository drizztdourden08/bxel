/* @layer renderer-app @kind logic */
import { entryKindOf } from '@bxel/project';
import { getPlatform, toast } from '@drizztdourden08/brock-react';
import { fileName } from '../files/file-name';
import { runFileAction } from '../files/run-file-action';
import { readImage } from '../image-import/read-image';
import { useImportStore } from '../stores/useImportStore';
import { focusTab } from '../workspace/focus-tab';
import type { AssetRow } from './asset-list.type';
import { rowTab } from './row-tab';

const openImage = async (path: string): Promise<void> => {
  const { documents } = getPlatform();
  if (!documents) return;
  const read = readImage(await documents.read(path), fileName(path));
  if (read.ok) useImportStore.getState().show(read.image);
  else toast(read.message, { variant: 'warning' });
};

const openRow = (row: AssetRow): void => {
  const tab = rowTab(row);
  if (tab) {
    focusTab(tab);
    return;
  }
  if (row.kind === 'image') void openImage(row.path);
  else if (row.kind !== 'other' || entryKindOf(row.name) === 'legacy') void runFileAction({ kind: 'openPath', path: row.path });
};

export { openRow };

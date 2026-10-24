/* @layer renderer-app @kind logic */
import { fileExtension } from '../files/file-extension';
import { fileName } from '../files/file-name';
import { renameEntry } from '../project/rename-entry';
import type { ProjectOutcome } from '../project/project.type';
import { useDocumentStore } from '../stores/useDocumentStore';
import { parentOf } from '../workspace/parent-of';
import { renameAsset } from '../workspace/rename-asset';
import type { AssetRow } from './asset-list.type';
import { ASSET_LIST_TEXT } from './asset-list-text.constants';
import { rowTab } from './row-tab';

const renameLoaded = (row: AssetRow, typed: string): ProjectOutcome => {
  const tab = rowTab(row);
  const { host } = useDocumentStore.getState();
  return tab && renameAsset(host, tab.documentId, tab.key, typed) ? { ok: true } : { ok: false, message: ASSET_LIST_TEXT.renameFailed };
};

const renameFile = async (row: AssetRow, typed: string): Promise<ProjectOutcome> => {
  const ending = row.kind === 'image' || row.kind === 'other' ? '' : `.${fileExtension(fileName(row.path))}`;
  return renameEntry({ dir: parentOf(row.path), name: fileName(row.path), kind: 'file' }, `${typed}${ending}`);
};

const renameRow = async (row: AssetRow, typed: string): Promise<ProjectOutcome> => {
  const name = typed.trim();
  if (name === '') return { ok: false, message: ASSET_LIST_TEXT.nameEmpty };
  return row.loaded ? renameLoaded(row, name) : renameFile(row, name);
};

export { renameRow };

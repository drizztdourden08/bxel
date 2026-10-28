/* @layer renderer-app @kind logic */
import type { AssetRow } from '../asset-list/asset-list.type';
import { baseName } from '../files/base-name';
import { kindOfName } from './kind-of-name';
import { PLAIN_KINDS } from './project-browser.constants';
import type { BrowserEntry, BrowserItem, ItemKind } from './project-browser.type';

const shownName = (entry: BrowserEntry, kind: ItemKind, row: AssetRow | undefined): string => {
  if (row !== undefined && !PLAIN_KINDS.includes(row.kind)) return row.name;
  return PLAIN_KINDS.includes(kind) ? entry.name : baseName(entry.name);
};

const entryItem = (entry: BrowserEntry, parentKey: string, row: AssetRow | undefined): BrowserItem => {
  const kind: ItemKind = entry.isFolder ? 'folder' : kindOfName(entry.name);
  return {
    key: entry.path,
    parentKey,
    role: entry.isFolder ? 'folder' : 'file',
    kind,
    name: entry.isFolder ? entry.name : shownName(entry, kind, row),
    fileName: entry.name,
    path: entry.path,
    rootKey: entry.rootPath,
    row: row ?? null,
    modified: entry.modified,
    size: entry.size,
    readOnly: false,
    failed: false,
  };
};

export { entryItem };

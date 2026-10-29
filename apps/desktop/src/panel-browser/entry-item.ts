/* @layer renderer-app @kind logic */
import type { AssetRow, ListedFile } from '../asset-list/asset-list.type';
import { baseName } from '../files/base-name';
import { kindOfName } from './kind-of-name';
import { PLAIN_KINDS } from './project-browser.constants';
import type { BrowserItem, ItemKind } from './project-browser.type';

const shownName = (file: ListedFile, kind: ItemKind, row: AssetRow): string => {
  if (!PLAIN_KINDS.includes(row.kind)) return row.name;
  return PLAIN_KINDS.includes(kind) ? file.name : baseName(file.name);
};

const entryItem = (file: ListedFile, parentKey: string, rootKey: string | null, row: AssetRow): BrowserItem => {
  const kind = kindOfName(file.name);
  return {
    key: file.path,
    parentKey,
    role: 'file',
    kind,
    name: shownName(file, kind, row),
    fileName: file.name,
    path: file.path,
    rootKey,
    row,
    modified: file.modified,
    size: file.size,
    readOnly: false,
    failed: false,
  };
};

export { entryItem };

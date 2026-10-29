/* @layer renderer-app @kind logic */
import type { AssetRow } from '../asset-list/asset-list.type';
import { fileName } from '../files/file-name';
import type { BrowserItem } from './project-browser.type';

const ghostItem = (row: AssetRow, parentKey: string, rootKey: string): BrowserItem => ({
  key: row.path,
  parentKey,
  role: 'ghost',
  kind: row.kind,
  name: row.name,
  fileName: fileName(row.path),
  path: row.path,
  rootKey,
  row,
  modified: row.modified,
  size: 0,
  readOnly: false,
  failed: false,
});

export { ghostItem };

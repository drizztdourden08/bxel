/* @layer renderer-app @kind logic */
import type { AssetRow } from '../asset-list/asset-list.type';
import type { BrowserItem } from './project-browser.type';

const unsavedItem = (row: AssetRow, parentKey: string): BrowserItem => ({
  key: row.id,
  parentKey,
  role: 'file',
  kind: row.kind,
  name: row.name,
  fileName: row.name,
  path: '',
  rootKey: null,
  row,
  modified: 0,
  size: 0,
  readOnly: false,
  failed: false,
});

export { unsavedItem };

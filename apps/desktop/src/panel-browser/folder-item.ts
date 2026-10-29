/* @layer renderer-app @kind logic */
import { fileName } from '../files/file-name';
import { parentOf } from '../workspace/parent-of';
import type { BrowserItem } from './project-browser.type';

const folderItem = (path: string, rootKey: string): BrowserItem => ({
  key: path,
  parentKey: parentOf(path),
  role: 'folder',
  kind: 'folder',
  name: fileName(path),
  fileName: fileName(path),
  path,
  rootKey,
  row: null,
  modified: 0,
  size: 0,
  readOnly: false,
  failed: false,
});

export { folderItem };

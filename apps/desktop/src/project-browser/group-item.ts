/* @layer renderer-app @kind logic */
import type { BrowserItem } from './project-browser.type';

const groupItem = (key: string, name: string): BrowserItem => ({
  key,
  parentKey: null,
  role: 'group',
  kind: 'group',
  name,
  fileName: name,
  path: '',
  rootKey: null,
  row: null,
  modified: 0,
  size: 0,
  readOnly: false,
  failed: false,
});

export { groupItem };

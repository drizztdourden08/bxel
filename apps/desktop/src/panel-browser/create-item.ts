/* @layer renderer-app @kind logic */
import { FILE_NEW_KEY } from './project-browser.constants';
import type { BrowserItem, ItemTree } from './project-browser.type';
import type { CreateTarget } from './browser-state.type';

const createItem = (target: CreateTarget, tree: ItemTree): BrowserItem => ({
  key: FILE_NEW_KEY,
  parentKey: target.parentKey,
  role: 'file',
  kind: 'sprite',
  name: '',
  fileName: '',
  path: '',
  rootKey: tree.items.get(target.parentKey)?.rootKey ?? null,
  row: null,
  modified: 0,
  size: 0,
  readOnly: false,
  failed: false,
});

export { createItem };

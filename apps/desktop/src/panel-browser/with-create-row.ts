/* @layer renderer-app @kind logic */
import { FILE_NEW_KEY, FOLDER_NEW_KEY } from './project-browser.constants';
import type { BrowserItem, CreateTarget, ItemTree, VisibleRow } from './project-browser.type';

const pending = (target: CreateTarget, tree: ItemTree): BrowserItem => ({
  key: target.create === 'folder' ? FOLDER_NEW_KEY : FILE_NEW_KEY,
  parentKey: target.parentKey,
  role: target.create === 'folder' ? 'folder' : 'file',
  kind: target.create === 'folder' ? 'folder' : 'sprite',
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

const withCreateRow = (rows: readonly VisibleRow[], target: CreateTarget | null, tree: ItemTree): readonly VisibleRow[] => {
  if (target === null) return rows;
  const at = rows.findIndex((row) => row.item.key === target.parentKey);
  const parent = at < 0 ? undefined : rows[at];
  const row: VisibleRow = { item: pending(target, tree), depth: parent ? parent.depth + 1 : 0, posinset: 1, setsize: 1, expanded: null };
  const index = parent ? at + 1 : 0;
  return [...rows.slice(0, index), row, ...rows.slice(index)];
};

export { withCreateRow };

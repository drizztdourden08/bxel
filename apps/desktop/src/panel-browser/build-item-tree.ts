/* @layer renderer-app @kind logic */
import type { AssetRow } from '../asset-list/asset-list.type';
import { parentOf } from '../workspace/parent-of';
import { toSlashes } from '../workspace/to-slashes';
import { entryItem } from './entry-item';
import { folderItem } from './folder-item';
import { ghostItems } from './ghost-items';
import { groupItem } from './group-item';
import { listableUnder } from './listable-under';
import { UNSAVED_KEY, UNSAVED_NAME } from './project-browser.constants';
import type { BrowserItem, ItemTree, TreeInput } from './project-browser.type';
import { rootItem } from './root-item';
import { rootOf } from './root-of';
import { rowsByPath } from './rows-by-path';
import { sortChildren } from './sort-children';
import { unsavedItem } from './unsaved-item';

const withKeyedItems = (items: Map<string, BrowserItem>, added: readonly BrowserItem[]): void => {
  for (const item of added) items.set(item.key, item);
};

const lowerIndex = (items: ReadonlyMap<string, BrowserItem>): ReadonlyMap<string, string> =>
  new Map([...items.keys()].map((key) => [key.toLowerCase(), key] as const));

const folderItems = (input: TreeInput, roots: readonly string[]): readonly BrowserItem[] =>
  input.folders.flatMap((path) => {
    const root = rootOf(path, roots);
    return root !== undefined && listableUnder(path, root) ? [folderItem(path, root)] : [];
  });

const fileItems = (input: TreeInput, roots: readonly string[]): readonly BrowserItem[] => {
  const byPath = rowsByPath(input.rows);
  return input.files.flatMap((file) => {
    const row = byPath.get(file.path.toLowerCase());
    return row === undefined ? [] : [entryItem(file, parentOf(file.path), rootOf(file.path, roots) ?? null, row)];
  });
};

const attach = (items: ReadonlyMap<string, BrowserItem>): ReadonlyMap<string | null, readonly string[]> => {
  const known = lowerIndex(items);
  const groups = new Map<string | null, string[]>();
  for (const item of items.values()) {
    if (item.parentKey === null) continue;
    const parent = known.get(item.parentKey.toLowerCase()) ?? item.rootKey;
    groups.set(parent, [...(groups.get(parent) ?? []), item.key]);
  }
  return new Map([...groups].map(([parent, keys]) => [parent, sortChildren(keys, items)] as const));
};

const unwritten = (row: AssetRow, known: ReadonlyMap<string, string>): boolean => row.loaded && row.dirty && !known.has(toSlashes(row.path).toLowerCase());

const unsavedRows = (rows: readonly AssetRow[], known: ReadonlyMap<string, string>, listed: boolean): readonly AssetRow[] =>
  rows.filter((row) => row.path === '' || (listed && unwritten(row, known)));

const buildItemTree = (input: TreeInput): ItemTree => {
  const roots = input.roots.map(rootItem);
  const rootKeys = roots.map((root) => root.key);
  const items = new Map<string, BrowserItem>();
  withKeyedItems(items, roots);
  withKeyedItems(items, folderItems(input, rootKeys));
  withKeyedItems(items, fileItems(input, rootKeys));
  const ghostRoots = input.listed ? roots.filter((root) => !root.readOnly).map((root) => root.key) : [];
  const listedKeys = lowerIndex(items);
  withKeyedItems(items, ghostItems(input.rows, listedKeys, ghostRoots));
  const unsaved = unsavedRows(input.rows, listedKeys, input.listed);
  if (unsaved.length > 0) {
    items.set(UNSAVED_KEY, groupItem(UNSAVED_KEY, UNSAVED_NAME));
    withKeyedItems(items, unsaved.map((row) => unsavedItem(row, UNSAVED_KEY)));
  }
  const children = new Map(attach(items));
  const main = roots.find((root) => root.role === 'folder');
  children.set(null, [...rootKeys, ...(unsaved.length > 0 ? [UNSAVED_KEY] : [])]);
  return { items, children, mainKey: main?.key ?? null };
};

export { buildItemTree };

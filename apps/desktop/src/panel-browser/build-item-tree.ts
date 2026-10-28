/* @layer renderer-app @kind logic */
import type { AssetRow } from '../asset-list/asset-list.type';
import { parentOf } from '../workspace/parent-of';
import { entryItem } from './entry-item';
import { ghostItems } from './ghost-items';
import { groupItem } from './group-item';
import { rootItem } from './root-item';
import { rowsByPath } from './rows-by-path';
import { sortChildren } from './sort-children';
import { unsavedItem } from './unsaved-item';
import { UNSAVED_KEY, UNSAVED_NAME } from './project-browser.constants';
import type { BrowserItem, ItemTree, TreeInput } from './project-browser.type';

const withKeyedItems = (items: Map<string, BrowserItem>, added: readonly BrowserItem[]): void => {
  for (const item of added) items.set(item.key, item);
};

const lowerIndex = (items: ReadonlyMap<string, BrowserItem>): ReadonlyMap<string, string> =>
  new Map([...items.keys()].map((key) => [key.toLowerCase(), key] as const));

const fileItems = (input: TreeInput): readonly BrowserItem[] => {
  const byPath = rowsByPath(input.rows);
  return input.entries.map((entry) => entryItem(entry, parentOf(entry.path), byPath.get(entry.path.toLowerCase())));
};

const parentFor = (item: BrowserItem, known: ReadonlyMap<string, string>): string | null => {
  if (item.parentKey === null) return null;
  return known.get(item.parentKey.toLowerCase()) ?? item.rootKey;
};

const attach = (items: ReadonlyMap<string, BrowserItem>): ReadonlyMap<string | null, readonly string[]> => {
  const known = lowerIndex(items);
  const groups = new Map<string | null, string[]>();
  for (const item of items.values()) {
    if (item.role === 'linked' || (item.role === 'folder' && item.parentKey === null)) continue;
    const parent = parentFor(item, known);
    groups.set(parent, [...(groups.get(parent) ?? []), item.key]);
  }
  return new Map([...groups].map(([parent, keys]) => [parent, sortChildren(keys, items)] as const));
};

const unsavedRows = (rows: readonly AssetRow[]): readonly AssetRow[] => rows.filter((row) => row.path === '');

const buildItemTree = (input: TreeInput): ItemTree => {
  const failed = new Set(input.failed);
  const roots = input.roots.map((root) => rootItem(root, failed));
  const items = new Map<string, BrowserItem>();
  withKeyedItems(items, roots);
  withKeyedItems(items, fileItems(input));
  const ghostRoots = input.listed ? roots.filter((root) => !root.failed && !root.readOnly).map((root) => root.key) : [];
  withKeyedItems(items, ghostItems(input.rows, lowerIndex(items), ghostRoots));
  const unsaved = unsavedRows(input.rows);
  if (unsaved.length > 0) {
    items.set(UNSAVED_KEY, groupItem(UNSAVED_KEY, UNSAVED_NAME));
    withKeyedItems(items, unsaved.map((row) => unsavedItem(row, UNSAVED_KEY)));
  }
  const children = new Map(attach(items));
  const main = roots.find((root) => root.role === 'folder');
  children.set(null, [...roots.map((root) => root.key), ...(unsaved.length > 0 ? [UNSAVED_KEY] : [])]);
  return { items, children, mainKey: main?.key ?? null };
};

export { buildItemTree };

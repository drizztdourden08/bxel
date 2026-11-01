/* @layer core @kind logic */
import { isGroupItem } from './is-group-item';
import type { TreeItem } from './tree-item.type';

const inCycle = <T extends TreeItem>(byId: ReadonlyMap<string, T>, item: T): boolean => {
  const seen = new Set<string>();
  let current: T | undefined = item;
  while (current?.parentId !== undefined) {
    if (seen.has(current.id)) return true;
    seen.add(current.id);
    current = byId.get(current.parentId);
  }
  return false;
};

const keepsParent = <T extends TreeItem>(byId: ReadonlyMap<string, T>, item: T): boolean =>
  item.parentId === undefined || (isGroupItem(byId.get(item.parentId)) && !inCycle(byId, item));

const normalizeTree = <T extends TreeItem>(items: readonly T[], detach: (item: T) => T): T[] => {
  const byId = new Map(items.map((item) => [item.id, item]));
  const cleaned = items.map((item) => (keepsParent(byId, item) ? item : detach(item)));
  const children = new Map<string | undefined, T[]>();
  for (const item of cleaned) children.set(item.parentId, [...(children.get(item.parentId) ?? []), item]);
  const emit = (item: T): T[] => [...(children.get(item.id) ?? []).flatMap(emit), item];
  const out = (children.get(undefined) ?? []).flatMap(emit);
  const same = out.length === items.length && out.every((item, index) => item === items[index]);
  return same ? [...items] : out;
};

export { normalizeTree };

/* @layer core @kind logic */
import type { TreeItem } from './tree-item.type';

const reparentItem = <T extends TreeItem>(item: T, parentId: string | undefined): T => {
  if (item.parentId === parentId) return item;
  const next: { -readonly [Key in keyof T]: T[Key] } = { ...item };
  if (parentId === undefined) delete next.parentId;
  else next.parentId = parentId as T['parentId'];
  return next;
};

export { reparentItem };

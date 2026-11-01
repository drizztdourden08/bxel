/* @layer core @kind logic */
import { ancestorsOf } from './ancestors-of';
import type { TreeItem } from './tree-item.type';

const shownInTree = <T extends TreeItem>(items: readonly T[], item: T): boolean => item.visible && ancestorsOf(items, item).every((parent) => parent.visible);

export { shownInTree };

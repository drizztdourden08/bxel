/* @layer core @kind logic */
import { ancestorsOf } from './ancestors-of';
import type { TreeItem } from './tree-item.type';

const depthOf = <T extends TreeItem>(items: readonly T[], item: T): number => ancestorsOf(items, item).length;

export { depthOf };

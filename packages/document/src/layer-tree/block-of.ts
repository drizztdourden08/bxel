/* @layer core @kind logic */
import { descendantIds } from './descendant-ids';
import type { TreeItem } from './tree-item.type';

const blockOf = <T extends TreeItem>(items: readonly T[], id: string): Set<string> => new Set([id, ...descendantIds(items, id)]);

export { blockOf };

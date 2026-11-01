/* @layer core @kind logic */
import { depthOf } from './depth-of';
import { MAX_LAYER_DEPTH } from './layer-tree.constants';
import type { TreeItem } from './tree-item.type';

const treeTooDeep = <T extends TreeItem>(items: readonly T[]): T | undefined => items.find((item) => depthOf(items, item) > MAX_LAYER_DEPTH);

export { treeTooDeep };

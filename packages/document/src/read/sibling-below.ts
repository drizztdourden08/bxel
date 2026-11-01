/* @layer core @kind logic */
import { siblingItemBelow } from '../layer-tree/sibling-item-below';
import type { Layer } from '../model/sprite.type';

const siblingBelow = (layers: readonly Layer[], index: number): Layer | undefined => siblingItemBelow(layers, index);

export { siblingBelow };

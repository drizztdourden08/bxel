/* @layer renderer-app @kind logic */
import type { LayerActions } from './layer-actions.type';

const noop = (): void => undefined;

const NO_TREE_ACTIONS: Pick<LayerActions, 'moveTo' | 'setView' | 'group' | 'ungroup' | 'mergeSelected' | 'toLayer' | 'addReference' | 'relink'> = {
  moveTo: noop,
  setView: noop,
  group: noop,
  ungroup: noop,
  mergeSelected: noop,
  toLayer: noop,
  addReference: noop,
  relink: noop,
};

export { NO_TREE_ACTIONS };

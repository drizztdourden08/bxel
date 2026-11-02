/* @layer renderer-app @kind logic */
import { useTilesetViewStore } from '../stores/useTilesetViewStore';
import { setShapes } from './set-shapes';
import { selectedKeys } from './selected-keys';

const setCollisionKind = (kind: 'none' | 'full', keys?: readonly number[]): boolean => {
  const targets = keys ?? selectedKeys();
  if (kind === 'none') return setShapes(targets, [], 'set');
  return setShapes(targets, [{ kind: 'full', layer: useTilesetViewStore.getState().collisionLayer }], 'layer');
};

export { setCollisionKind };

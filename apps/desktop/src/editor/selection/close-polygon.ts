/* @layer renderer-app @kind logic */
import type { CombineMode } from '@bxel/raster';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { currentTarget } from '../current-target';
import { incomingMask } from './incoming-mask';
import { mergeMask } from './merge-mask';
import { POLYGON_MIN_VERTICES } from './selection.constants';
import { selectionMask } from './selection-mask';
import { setSelection } from './set-selection';

const closePolygon = (mode?: CombineMode): boolean => {
  const store = useSelectionStore.getState();
  const target = currentTarget();
  const { vertices } = store;
  if (!target || vertices.length === 0) return false;
  if (vertices.length >= POLYGON_MIN_VERTICES) {
    const shape = { variant: 'polygon', from: vertices[0] ?? { x: 0, y: 0 }, to: vertices.at(-1) ?? { x: 0, y: 0 }, path: vertices } as const;
    setSelection(target, mergeMask(selectionMask(target), incomingMask(shape, target.sprite), mode ?? store.mode));
  }
  store.setVertices([]);
  return true;
};

export { closePolygon };

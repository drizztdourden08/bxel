/* @layer renderer-app @kind logic */
import { combineCellMasks } from '@bxel/document';
import type { CombineMode } from '@bxel/raster';
import type { MapSelection } from '../stores/tilemap-store.type';
import { selectionMaskOf } from './selection-mask-of';
import { selectionOfMask } from './selection-of-mask';
import type { MapTarget } from './tilemap.type';

const mergeSelection = (current: MapSelection | null, incoming: Uint8Array, mode: CombineMode, target: Pick<MapTarget, 'tilemap' | 'layer'>): MapSelection | null => {
  if (mode === 'replace' || current === null) return mode === 'subtract' || mode === 'intersect' ? null : selectionOfMask(incoming, target);
  return selectionOfMask(combineCellMasks(selectionMaskOf(current, target.tilemap), incoming, mode), target);
};

export { mergeSelection };

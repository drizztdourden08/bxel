/* @layer renderer-app @kind logic */
import { resolveCellMask } from '@bxel/document';
import type { CellMaskDescriptor } from '@bxel/document';
import type { CombineMode } from '@bxel/raster';
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentMap } from './current-map';
import { mergeSelection } from './merge-selection';
import { commitMapSelection } from './commit-map-selection';

const selectCells = (descriptor: CellMaskDescriptor, mode: CombineMode): boolean => {
  const target = currentMap();
  if (!target) return false;
  const { columns, rows } = target.tilemap;
  const incoming = resolveCellMask(descriptor, { columns, rows, cells: target.layer.cells });
  const store = useTilemapStore.getState();
  commitMapSelection(mergeSelection(store.selection, incoming, mode, target));
  return true;
};

export { selectCells };

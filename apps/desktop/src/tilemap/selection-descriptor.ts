/* @layer renderer-app @kind logic */
import { cellMaskRuns } from '@bxel/document';
import type { CellMaskDescriptor, Tilemap } from '@bxel/document';
import type { MapSelection } from '../stores/tilemap-store.type';
import { selectionMaskOf } from './selection-mask-of';

const selectionDescriptor = (selection: MapSelection, tilemap: Tilemap): CellMaskDescriptor => {
  if (selection.mask === null) return { by: 'rect', rect: selection.rect };
  return { by: 'runs', runs: cellMaskRuns(selectionMaskOf(selection, tilemap), tilemap.columns) };
};

export { selectionDescriptor };

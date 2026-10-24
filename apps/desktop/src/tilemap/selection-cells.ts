/* @layer renderer-app @kind logic */
import type { Point, Tilemap } from '@bxel/document';
import type { MapSelection } from '../stores/tilemap-store.type';
import { inBounds } from './in-bounds';
import { rectCells } from './rect-cells';

const selectionCells = (selection: MapSelection, tilemap: Tilemap): Point[] =>
  rectCells(selection.rect, true).filter((cell) => inBounds(tilemap, cell));

export { selectionCells };

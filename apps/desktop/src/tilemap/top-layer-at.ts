/* @layer renderer-app @kind logic */
import { isGroupItem, shownInTree } from '@bxel/document';
import type { MapLayer, Point, Tilemap } from '@bxel/document';
import { readCell } from './read-cell';

const topLayerAt = (tilemap: Tilemap, at: Point): MapLayer | null =>
  [...tilemap.layers]
    .reverse()
    .find((layer) => !isGroupItem(layer) && shownInTree(tilemap.layers, layer) && (readCell(tilemap, layer, at)?.key ?? 0) !== 0) ?? null;

export { topLayerAt };

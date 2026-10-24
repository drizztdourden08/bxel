/* @layer core @kind logic */
import type { Tilemap } from '../../model/tilemap.type';
import { cellIndex } from './cell-index';
import type { Placement } from './map-layer.type';
import { strokeIndexes } from './stroke-indexes';

const placementIndexes = (tilemap: Tilemap, placement: Placement): number[] => {
  if (placement.points) return strokeIndexes(tilemap, placement.points);
  return (placement.cells ?? []).map((point, index) => cellIndex(tilemap, point, `options.cells.${index}`));
};

export { placementIndexes };

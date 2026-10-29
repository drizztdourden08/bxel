/* @layer core @kind logic */
import type { TerrainKind } from '../model/tilemap.type';
import { reduceMask } from './reduce-mask';
import { BLOB16_EDGES, BLOB47_MASKS, CORNER_BITS, CORNER_EDGES, NEIGHBOUR } from './terrain.constants';

const edgeIndex = (mask: number): number =>
  (mask & NEIGHBOUR.N ? 1 : 0) | (mask & NEIGHBOUR.E ? 2 : 0) | (mask & NEIGHBOUR.S ? 4 : 0) | (mask & NEIGHBOUR.W ? 8 : 0);

const cornerIndex = (mask: number): number =>
  CORNER_BITS.reduce((index, bit, at) => {
    const edges = CORNER_EDGES[at] ?? 0;
    return (mask & bit) !== 0 && (mask & edges) === edges ? index | (1 << at) : index;
  }, 0);

const terrainIndex = (kind: TerrainKind, mask: number): number => {
  if (kind === 'blob16') return edgeIndex(mask & BLOB16_EDGES);
  return kind === 'corner16' ? cornerIndex(mask) : BLOB47_MASKS.indexOf(reduceMask(mask));
};

export { terrainIndex };

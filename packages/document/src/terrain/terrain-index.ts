/* @layer core @kind logic */
import type { TerrainKind } from '../model/tilemap.type';
import { reduceMask } from './reduce-mask';
import { BLOB16_EDGES, BLOB47_MASKS, NEIGHBOUR } from './terrain.constants';

const edgeIndex = (mask: number): number =>
  (mask & NEIGHBOUR.N ? 1 : 0) | (mask & NEIGHBOUR.E ? 2 : 0) | (mask & NEIGHBOUR.S ? 4 : 0) | (mask & NEIGHBOUR.W ? 8 : 0);

const terrainIndex = (kind: TerrainKind, mask: number): number =>
  kind === 'blob16' ? edgeIndex(mask & BLOB16_EDGES) : BLOB47_MASKS.indexOf(reduceMask(mask));

export { terrainIndex };

/* @layer core @kind logic */
import type { TerrainKind } from '../model/tilemap.type';
import { BLOB47_MASKS, NEIGHBOUR } from './terrain.constants';

const edgeMask = (index: number): number =>
  (index & 1 ? NEIGHBOUR.N : 0) | (index & 2 ? NEIGHBOUR.E : 0) | (index & 4 ? NEIGHBOUR.S : 0) | (index & 8 ? NEIGHBOUR.W : 0);

const slotMask = (kind: TerrainKind, index: number): number => (kind === 'blob16' ? edgeMask(index) : (BLOB47_MASKS[index] ?? 0));

export { slotMask };

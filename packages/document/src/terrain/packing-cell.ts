/* @layer core @kind logic */
import type { TerrainPacking } from './terrain-packing.type';

const packingCell = (packing: TerrainPacking, slot: number): { column: number; row: number } => ({
  column: slot % packing.columns,
  row: Math.floor(slot / packing.columns),
});

export { packingCell };

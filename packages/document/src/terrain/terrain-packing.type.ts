/* @layer core @kind types */
import type { TerrainKind } from '../model/tilemap.type';

interface TerrainPacking {
  id: string;
  kind: TerrainKind;
  label: string;
  columns: number;
  rows: number;
}

export type { TerrainPacking };

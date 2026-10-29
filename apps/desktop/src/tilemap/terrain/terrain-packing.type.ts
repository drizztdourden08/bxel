/* @layer renderer-app @kind types */
import type { TerrainKind } from '@bxel/document';

interface TerrainPacking {
  id: string;
  kind: TerrainKind;
  label: string;
  columns: number;
  rows: number;
}

export type { TerrainPacking };

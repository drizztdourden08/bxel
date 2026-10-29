/* @layer renderer-app @kind types */
import type { TerrainSet } from '@bxel/document';

interface TerrainChoice {
  sets: readonly TerrainSet[];
  set: TerrainSet | undefined;
}

export type { TerrainChoice };

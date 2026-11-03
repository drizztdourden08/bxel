/* @layer renderer-app @kind types */
import type { TerrainSet } from '@bxel/document';

interface MarkEdit {
  mask: number;
  set: TerrainSet | null;
  changed: boolean;
}

export type { MarkEdit };

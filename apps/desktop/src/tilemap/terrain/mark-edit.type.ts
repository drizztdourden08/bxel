/* @layer renderer-app @kind types */
import type { TerrainSet } from '@bxel/document';

interface MarkEdit {
  mask: number;
  set: TerrainSet | null;
  changed: boolean;
}

interface MarkEditInput {
  set: TerrainSet;
  mask: number;
  key: number;
  bit: number;
  on: boolean;
}

export type { MarkEdit, MarkEditInput };

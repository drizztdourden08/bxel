/* @layer renderer-app @kind types */
import type { FieldValue, TileTurns } from '@bxel/document';

interface TileDataPatch {
  type?: string | null;
  probability?: number | null;
  turns?: TileTurns | null;
  data?: Readonly<Record<string, FieldValue | null>>;
}

export type { TileDataPatch };

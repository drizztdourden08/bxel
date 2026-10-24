/* @layer renderer-app @kind types */
import type { TilesetId } from '@bxel/document';

interface TilesetForm {
  name: string;
  width: number;
  height: number;
}

interface TilemapForm {
  name: string;
  tilesetId: TilesetId | null;
  columns: number;
  rows: number;
}

export type { TilemapForm, TilesetForm };

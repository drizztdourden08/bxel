/* @layer renderer-app @kind types */
import type { TileShape, Tileset } from '@bxel/document';

interface EditorPaint {
  tile: HTMLCanvasElement | null;
  tileset: Tileset;
  shapes: readonly TileShape[];
  selected: number;
  zoom: number;
  preview: TileShape | null;
  point: number | null;
}

export type { EditorPaint };

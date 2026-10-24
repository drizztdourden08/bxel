/* @layer renderer-app @kind types */
import type { OrientRequest, TilesetId } from '@bxel/document';

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
  orientation: OrientRequest['kind'];
  staggerAxis: 'x' | 'y';
  staggerIndex: 'odd' | 'even';
  hexSideLength: number;
}

export type { TilemapForm, TilesetForm };

/* @layer renderer-app @kind types */
import type { Tile, TileShape } from '@bxel/document';

interface PickedShape {
  readonly tile: Tile;
  readonly index: number;
  readonly shape: TileShape;
}

export type { PickedShape };

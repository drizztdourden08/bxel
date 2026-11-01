/* @layer renderer-app @kind types */
import type { Tile, tilesetImages } from '@bxel/document';
import type { TilesetOverlay } from './tool-input.type';

type TileImage = ReturnType<typeof tilesetImages>[number];

type FilledTile = { readonly tile: Tile; readonly image: TileImage };

type SlotFrame = {
  readonly width: number;
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly originX: number;
  readonly originY: number;
  readonly overlay: TilesetOverlay;
  readonly layers: readonly string[];
  readonly terrainOf: ReadonlyMap<number, number>;
};

export type { FilledTile, SlotFrame, TileImage };

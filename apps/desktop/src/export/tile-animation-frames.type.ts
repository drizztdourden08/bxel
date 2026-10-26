/* @layer renderer-app @kind types */
import type { Artwork, Tileset } from '@bxel/document';
import type { TileAnimationEntry, TilesetTile } from '@bxel/formats';

type TileFrames = {
  readonly tiles: readonly TilesetTile[];
  readonly animations: readonly TileAnimationEntry[];
  readonly skipped: readonly string[];
};

type FrameBuilder = {
  readonly tiles: TilesetTile[];
  readonly keys: Map<string, number>;
  next: number;
};

type FrameWorld = {
  readonly artwork: Artwork;
  readonly tileset: Tileset;
  readonly builder: FrameBuilder;
};

export type { FrameBuilder, FrameWorld, TileFrames };

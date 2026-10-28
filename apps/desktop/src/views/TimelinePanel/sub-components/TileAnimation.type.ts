/* @layer renderer-app @kind types */
import type { Artwork, Tile, Tileset } from '@bxel/document';

interface TileAnimationProps {
  artwork: Artwork;
  tileset: Tileset;
  tile: Tile;
}

export type { TileAnimationProps };

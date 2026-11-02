/* @layer renderer-app @kind logic */
import type { Artwork, Sprite } from '@bxel/document';

const tileSizeOfSprite = (artwork: Artwork | null, sprite: Sprite | null): { width: number; height: number } | null => {
  if (sprite?.role !== 'tile' || !artwork) return null;
  const tileset = artwork.tilesets.find((each) => each.tiles.some((tile) => tile.spriteId === sprite.id));
  return tileset ? { width: tileset.tileWidth, height: tileset.tileHeight } : null;
};

export { tileSizeOfSprite };

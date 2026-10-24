/* @layer renderer-app @kind logic */
import type { Artwork, Sprite } from '@bxel/document';
import type { DeleteImpact } from './delete.type';

const tilemapsUsing = (artwork: Artwork, sprite: Sprite): number => {
  const sets = new Set(artwork.tilesets.filter((tileset) => tileset.tiles.some((tile) => tile.spriteId === sprite.id)).map((tileset) => tileset.id));
  return artwork.tilemaps.filter((tilemap) => sets.has(tilemap.tilesetId)).length;
};

const deleteImpact = (artwork: Artwork, sprite: Sprite): DeleteImpact => ({
  id: sprite.id,
  name: sprite.name,
  sheets: artwork.sheets.filter((sheet) => sheet.entries.some((entry) => entry.spriteId === sprite.id)).length,
  tilemaps: tilemapsUsing(artwork, sprite),
});

export { deleteImpact };

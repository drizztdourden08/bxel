/* @layer renderer-app @kind logic */
import type { Tileset } from '@bxel/document';

const tilesetSummary = (detailed: boolean) => (tileset: Tileset) => ({
  tilesetId: tileset.id,
  name: tileset.name,
  bankId: tileset.bankId,
  tileWidth: tileset.tileWidth,
  tileHeight: tileset.tileHeight,
  tiles: tileset.tiles.length,
  ...(detailed
    ? {
        terrain: tileset.terrain?.kind ?? null,
        tileList: tileset.tiles.map((tile) => ({
          key: tile.key,
          spriteId: tile.spriteId,
          collision: tile.collision?.kind ?? null,
          animationId: tile.animation?.animationId ?? null,
        })),
      }
    : {}),
});

export { tilesetSummary };

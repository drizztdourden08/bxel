/* @layer renderer-app @kind logic */
import { findSprite, flattenFrame } from '@bxel/document';
import type { SpriteId, Tileset } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { TILE_DROP_TEXT } from './tile-drag.constants';
import type { BlocksRead, TileBlock } from './tile-drag.type';

const spriteBlocks = (ids: readonly string[], tileset: Tileset): BlocksRead => {
  const artwork = currentArtwork();
  const sprites = ids.flatMap((id) => (artwork ? (findSprite(artwork, id as SpriteId) ?? []) : []));
  if (sprites.length === 0) return { ok: false, reason: TILE_DROP_TEXT.noSprites };
  const odd = sprites.find((sprite) => sprite.width !== tileset.tileWidth || sprite.height !== tileset.tileHeight);
  if (odd) return { ok: false, reason: TILE_DROP_TEXT.wrongSize(odd.width, odd.height, tileset.tileWidth, tileset.tileHeight) };
  if (sprites.some((sprite) => sprite.bankId !== tileset.bankId)) return { ok: false, reason: TILE_DROP_TEXT.wrongPalette };
  const blocks = sprites.flatMap((sprite): TileBlock[] => {
    const frame = sprite.frames[0];
    return frame ? [{ width: sprite.width, height: sprite.height, pixels: flattenFrame(sprite, frame.id) }] : [];
  });
  return { ok: true, blocks };
};

export { spriteBlocks };

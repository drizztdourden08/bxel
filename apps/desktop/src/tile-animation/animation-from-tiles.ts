/* @layer renderer-app @kind logic */
import { findSprite, findTile, flattenFrame } from '@bxel/document';
import type { Artwork, Tileset } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { uniqueName } from '../sprite-name/unique-name';
import { fromTilesSteps } from './from-tiles-steps';
import { TILE_ANIMATION_LABEL, TILE_ANIMATION_TEXT } from './tile-animation.constants';

const animationFromTiles = (artwork: Artwork, tileset: Tileset, keys: readonly number[]): boolean => {
  const frames = keys.flatMap((key) => {
    const tile = findTile(tileset, key);
    const sprite = tile ? findSprite(artwork, tile.spriteId) : undefined;
    const frame = sprite?.frames[0];
    return sprite && frame ? [flattenFrame(sprite, frame.id)] : [];
  });
  if (frames.length < 2 || frames.length !== keys.length) return false;
  const name = uniqueName(
    TILE_ANIMATION_TEXT.newTilesName(keys[0] ?? 0, keys.length),
    artwork.animations.map((each) => each.name),
  );
  return runDocument(TILE_ANIMATION_LABEL.fromTiles, fromTilesSteps(tileset, keys, { name, frames })) !== null;
};

export { animationFromTiles };

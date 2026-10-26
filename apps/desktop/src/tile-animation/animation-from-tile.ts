/* @layer renderer-app @kind logic */
import { findSprite, flattenFrame } from '@bxel/document';
import type { Artwork, Tile, Tileset } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { uniqueName } from '../sprite-name/unique-name';
import { fromTileSteps } from './from-tile-steps';
import { TILE_ANIMATION_LABEL, TILE_ANIMATION_TEXT } from './tile-animation.constants';

const animationFromTile = (artwork: Artwork, tileset: Tileset, tile: Tile): boolean => {
  const sprite = findSprite(artwork, tile.spriteId);
  const frame = sprite?.frames[0];
  if (!sprite || !frame) return false;
  const name = uniqueName(
    TILE_ANIMATION_TEXT.newName(tile.key),
    artwork.animations.map((each) => each.name),
  );
  const pixels = flattenFrame(sprite, frame.id);
  return runDocument(TILE_ANIMATION_LABEL.fromTile, fromTileSteps(tileset, tile.key, { name, pixels })) !== null;
};

export { animationFromTile };

/* @layer renderer-app @kind logic */
import { findSprite } from '@bxel/document';
import type { Artwork, Sprite } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import type { EditorTarget } from './editor.type';

const tileSprites = (target: EditorTarget, artwork: Artwork): Sprite[] => {
  const tileset = artwork.tilesets.find((each) => each.tiles.some((tile) => tile.spriteId === target.sprite.id));
  if (!tileset) return [target.sprite];
  return tileset.tiles.flatMap((tile) => findSprite(artwork, tile.spriteId) ?? []);
};

const frameSprites = (target: EditorTarget): Sprite[] => {
  const artwork = currentArtwork();
  if (!artwork) return [target.sprite];
  if (!target.animation) return target.sprite.role === 'tile' ? tileSprites(target, artwork) : [target.sprite];
  const ids = new Set(target.animation.animation.frames.flatMap((frame) => (frame.spriteId === null ? [] : [frame.spriteId])));
  return [...ids].flatMap((id) => findSprite(artwork, id) ?? []);
};

export { frameSprites };

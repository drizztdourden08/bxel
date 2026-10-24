/* @layer core @kind logic */
import type { Box } from '../pixels/box.type';
import type { SheetMetadata, SheetSpriteEntry } from './sheet-metadata.type';

const inside = (box: Box, width: number, height: number): boolean =>
  box.x >= 0 &&
  box.y >= 0 &&
  box.width >= 1 &&
  box.height >= 1 &&
  box.x + box.width <= width &&
  box.y + box.height <= height;

const isValidSprite = (sprite: SheetSpriteEntry, width: number, height: number): boolean =>
  sprite.width >= 1 &&
  sprite.height >= 1 &&
  sprite.frames.length >= 1 &&
  sprite.frames.every((frame) => inside(frame.box, width, height)) &&
  sprite.tags.every((tag) => tag.to < sprite.frames.length);

const isValidMetadata = (metadata: SheetMetadata): boolean =>
  metadata.width >= 1 &&
  metadata.height >= 1 &&
  metadata.scale >= 1 &&
  metadata.sprites.every((sprite) => isValidSprite(sprite, metadata.width, metadata.height));

export { isValidMetadata };

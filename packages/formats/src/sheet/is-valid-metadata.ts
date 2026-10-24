/* @layer core @kind logic */
import type { Box } from '../pixels/box.type';
import type { SheetFrameEntry, SheetMetadata, SheetSpriteEntry } from './sheet-metadata.type';

const inside = (box: Box, width: number, height: number): boolean =>
  box.x >= 0 &&
  box.y >= 0 &&
  box.width >= 1 &&
  box.height >= 1 &&
  box.x + box.width <= width &&
  box.y + box.height <= height;

const occupied = (frame: SheetFrameEntry): Box =>
  frame.rotated ? { ...frame.box, width: frame.box.height, height: frame.box.width } : frame.box;

const isValidSprite = (sprite: SheetSpriteEntry, width: number, height: number): boolean =>
  sprite.width >= 1 &&
  sprite.height >= 1 &&
  sprite.frames.length >= 1 &&
  sprite.frames.every((frame) => inside(occupied(frame), width, height)) &&
  sprite.tags.every((tag) => tag.to < sprite.frames.length);

const isValidMetadata = (metadata: SheetMetadata): boolean =>
  metadata.width >= 1 &&
  metadata.height >= 1 &&
  metadata.scale >= 1 &&
  metadata.sprites.every((sprite) => isValidSprite(sprite, metadata.width, metadata.height));

export { isValidMetadata };

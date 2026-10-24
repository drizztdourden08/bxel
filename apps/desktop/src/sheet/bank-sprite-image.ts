/* @layer renderer-app @kind logic */
import { frameToRgba } from '@bxel/document';
import type { PaletteBank, Sprite } from '@bxel/document';
import { IMAGE_CACHE } from './image-cache.constants';
import type { FrameImage } from './sheet.type';

const bankSpriteImage = (bank: PaletteBank | undefined, sprite: Sprite): FrameImage | null => {
  const frame = sprite.frames[0];
  if (!bank || !frame) return null;
  const banks = IMAGE_CACHE.get(sprite) ?? new WeakMap();
  IMAGE_CACHE.set(sprite, banks);
  if (banks.has(bank)) return banks.get(bank) ?? null;
  const image: FrameImage = { width: sprite.width, height: sprite.height, rgba: Uint8ClampedArray.from(frameToRgba(sprite, bank, frame.id)) };
  banks.set(bank, image);
  return image;
};

export { bankSpriteImage };

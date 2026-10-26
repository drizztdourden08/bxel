/* @layer renderer-app @kind logic */
import type { Artwork, SpriteId } from '@bxel/document';
import { blitImage } from './blit-image';
import { CHANNELS, OFF_SHEET_ALPHA } from './sheet.constants';
import type { FrameImage, SheetModel } from './sheet.type';
import { spriteImage } from './sprite-image';

const renderSheet = (artwork: Artwork, model: SheetModel, overrides: ReadonlyMap<SpriteId, FrameImage>): FrameImage => {
  const { width, height } = model.extent;
  const canvas: FrameImage = { width, height, rgba: new Uint8ClampedArray(width * height * CHANNELS) };
  for (const item of model.items) {
    const image = overrides.get(item.sprite.id) ?? spriteImage(artwork, item.sprite);
    if (image) blitImage(canvas, image, item.at, item.onSheet ? 1 : OFF_SHEET_ALPHA);
  }
  for (const item of model.animations) {
    let x = item.at.x;
    for (const image of item.images) {
      blitImage(canvas, image, { x, y: item.at.y }, 1);
      x += image.width + item.spacing;
    }
  }
  return canvas;
};

export { renderSheet };

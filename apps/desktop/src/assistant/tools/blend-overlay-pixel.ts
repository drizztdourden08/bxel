/* @layer renderer-app @kind logic */
import type { RgbaImage } from '@bxel/formats';
import { CHANNELS } from './blend-overlay-pixel.constants';
import type { OverlayInk } from './render-overlay.type';

const blendOverlayPixel = (image: RgbaImage, at: { readonly x: number; readonly y: number }, ink: OverlayInk): void => {
  if (at.x < 0 || at.y < 0 || at.x >= image.width || at.y >= image.height) return;
  const base = (at.y * image.width + at.x) * CHANNELS;
  ink.rgb.forEach((value, channel) => {
    image.data[base + channel] = Math.round((image.data[base + channel] ?? 0) * (1 - ink.alpha) + value * ink.alpha);
  });
  image.data[base + 3] = Math.max(image.data[base + 3] ?? 0, Math.round(ink.alpha * 255));
};

export { blendOverlayPixel };

/* @layer core @kind logic */
import type { Cel, Sprite } from '@bxel/document';
import type { Rect } from '../../geometry.type';
import { reframeBuffer } from '../../region/reframe-buffer';

const paddedPixels = (source: Sprite, cel: Cel, frame: Rect): Uint8Array => {
  if (frame.width === source.width && frame.height === source.height) return cel.pixels;
  return reframeBuffer({ pixels: cel.pixels, width: source.width, height: source.height }, frame).pixels;
};

export { paddedPixels };

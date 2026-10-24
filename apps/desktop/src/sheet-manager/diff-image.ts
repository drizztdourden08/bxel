/* @layer renderer-app @kind logic */
import { CHANNELS } from '../sheet/sheet.constants';
import type { FrameImage } from '../sheet/sheet.type';
import { DIFF_COLOUR, FADE } from './diff-image.constants';
import { pixelDiffers } from './pixel-differs';

const diffImage = (a: FrameImage, b: FrameImage): FrameImage => {
  const rgba = new Uint8ClampedArray(a.rgba.length);
  for (let at = 0; at < a.rgba.length; at += CHANNELS) {
    const faded = [a.rgba[at] ?? 0, a.rgba[at + 1] ?? 0, a.rgba[at + 2] ?? 0, Math.floor((a.rgba[at + 3] ?? 0) / FADE)];
    rgba.set(pixelDiffers(a.rgba, b.rgba, at) ? DIFF_COLOUR : faded, at);
  }
  return { width: a.width, height: a.height, rgba };
};

export { diffImage };

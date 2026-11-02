/* @layer renderer-app @kind logic */
import { paletteRgba, TRANSPARENT_INDEX } from '@bxel/document';
import type { PaletteBank, RgbaPicture } from '@bxel/document';
import type { Clip } from '../editor/selection/selection.type';

const clipPicture = (clip: Clip, bank: PaletteBank): RgbaPicture => {
  const table = paletteRgba(bank);
  const data = new Uint8ClampedArray(clip.pixels.length * 4);
  for (const [position, index] of clip.pixels.entries()) {
    if (index !== TRANSPARENT_INDEX) data.set(table.subarray(index * 4, index * 4 + 4), position * 4);
  }
  return { width: clip.width, height: clip.height, data };
};

export { clipPicture };

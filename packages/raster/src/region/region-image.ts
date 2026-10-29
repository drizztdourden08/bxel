/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import type { Rect } from '../geometry.type';
import type { IndexImage } from '../resample/resample.type';

const regionImage = (before: Uint8Array, mask: MaskView, box: Rect): IndexImage => {
  const pixels = new Uint8Array(box.width * box.height);
  for (let y = 0; y < box.height; y++) {
    for (let x = 0; x < box.width; x++) {
      const at = (box.y + y) * mask.width + box.x + x;
      if ((mask.bits[at] ?? 0) !== 0) pixels[y * box.width + x] = before[at] ?? 0;
    }
  }
  return { width: box.width, height: box.height, pixels };
};

export { regionImage };

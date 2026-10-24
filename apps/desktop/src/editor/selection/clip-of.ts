/* @layer renderer-app @kind logic */
import { maskBounds } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import type { Clip } from './selection.type';

const clipOf = (pixels: Uint8Array, mask: MaskView): Clip | null => {
  const box = maskBounds(mask);
  if (!box) return null;
  const copied = new Uint8Array(box.width * box.height);
  const bits = new Uint8Array(box.width * box.height);
  for (let row = 0; row < box.height; row += 1) {
    for (let column = 0; column < box.width; column += 1) {
      const from = (box.y + row) * mask.width + box.x + column;
      if ((mask.bits[from] ?? 0) === 0) continue;
      copied[row * box.width + column] = pixels[from] ?? 0;
      bits[row * box.width + column] = 1;
    }
  }
  return { width: box.width, height: box.height, origin: { x: box.x, y: box.y }, pixels: copied, bits };
};

export { clipOf };

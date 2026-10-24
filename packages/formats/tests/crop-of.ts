/* @layer tests @kind helper */
import type { Box, RgbaImage } from '@bxel/formats';

const cropOf = (image: RgbaImage, box: Box): number[] => {
  const out: number[] = [];
  for (let y = box.y; y < box.y + box.height; y += 1) {
    const from = (y * image.width + box.x) * 4;
    out.push(...image.data.subarray(from, from + box.width * 4));
  }
  return out;
};

export { cropOf };

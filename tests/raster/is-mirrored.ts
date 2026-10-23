/* @layer tests @kind logic */
import type { BufferView, Symmetry } from '../../packages/raster/src/index';

const isMirrored = (view: BufferView, symmetry: Symmetry): boolean => {
  const { pixels, width, height } = view;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const otherX = symmetry.x2 === undefined || symmetry.x2 === null ? x : symmetry.x2 - 1 - x;
      const otherY = symmetry.y2 === undefined || symmetry.y2 === null ? y : symmetry.y2 - 1 - y;
      const inside = otherX >= 0 && otherX < width && otherY >= 0 && otherY < height;
      if (inside && pixels[y * width + x] !== pixels[otherY * width + otherX]) {
        return false;
      }
    }
  }
  return true;
};

export { isMirrored };

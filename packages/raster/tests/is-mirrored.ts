/* @layer tests @kind logic */
import type { BufferView, Symmetry } from '@bxel/raster';

const mirrorOf = (coord: number, axis: number | null | undefined): number =>
  axis === undefined || axis === null ? coord : axis - 1 - coord;

const isMirrored = (view: BufferView, symmetry: Symmetry): boolean => {
  const { pixels, width, height } = view;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const otherX = mirrorOf(x, symmetry.x2);
      const otherY = mirrorOf(y, symmetry.y2);
      const inside = otherX >= 0 && otherX < width && otherY >= 0 && otherY < height;
      if (inside && pixels[y * width + x] !== pixels[otherY * width + otherX]) {
        return false;
      }
    }
  }
  return true;
};

export { isMirrored };

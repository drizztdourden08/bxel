/* @layer renderer-app @kind logic */
import { TRANSPARENT_INDEX } from '@bxel/document';

const solid = (indices: ArrayLike<number>, width: number, height: number, x: number, y: number): boolean =>
  x >= 0 && y >= 0 && x < width && y < height && indices[y * width + x] !== TRANSPARENT_INDEX;

const edgeMask = (indices: ArrayLike<number>, width: number, height: number): Uint8Array => {
  const mask = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!solid(indices, width, height, x, y)) continue;
      const inside = solid(indices, width, height, x - 1, y) && solid(indices, width, height, x + 1, y) && solid(indices, width, height, x, y - 1) && solid(indices, width, height, x, y + 1);
      mask[y * width + x] = inside ? 0 : 1;
    }
  }
  return mask;
};

export { edgeMask };

/* @layer core @kind logic */
import type { BufferView } from '../buffer.type';
import { foldCoord } from '../fold-coord';
import type { Wrap } from '../wrap.type';

/** The colour next to a pixel. Past the edge it is transparent, unless the preview wraps there. */
const neighbourAt = (source: BufferView, x: number, y: number, wrap: Wrap | undefined): number => {
  const { width, height, pixels } = source;
  const col = wrap?.x === true ? foldCoord(x, width) : x;
  const row = wrap?.y === true ? foldCoord(y, height) : y;
  if (col < 0 || row < 0 || col >= width || row >= height) return 0;
  return pixels[row * width + col] ?? 0;
};

export { neighbourAt };

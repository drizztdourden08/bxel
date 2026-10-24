/* @layer core @kind logic */
import { byteAt } from '../pixels/byte-at';
import type { RgbaImage } from '../png.type';
import type { GifDescriptor } from './gif.type';
import { interlaceRows } from './interlace-rows';

const paintGifFrame = (
  target: RgbaImage,
  descriptor: GifDescriptor,
  indices: Uint8Array,
  transparent: number,
): void => {
  const { x, y, width, height, table, interlaced } = descriptor;
  if (!table) return;
  const rows = interlaced ? interlaceRows(height) : undefined;
  for (let row = 0; row < height; row += 1) {
    const targetRow = y + (rows ? byteAt(rows, row) : row);
    for (let col = 0; col < width; col += 1) {
      const index = byteAt(indices, row * width + col);
      if (index === transparent) continue;
      const at = (targetRow * target.width + x + col) * 4;
      target.data[at] = byteAt(table, index * 3);
      target.data[at + 1] = byteAt(table, index * 3 + 1);
      target.data[at + 2] = byteAt(table, index * 3 + 2);
      target.data[at + 3] = 255;
    }
  }
};

export { paintGifFrame };

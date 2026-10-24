/* @layer renderer-app @kind logic */
import type { PixelBitmap } from './pixel-icon.type';

const transposeBitmap = (bitmap: PixelBitmap): PixelBitmap =>
  bitmap.map((_, row) => bitmap.map((line) => line[row] ?? '.').join(''));

export { transposeBitmap };

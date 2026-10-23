/* @layer core @kind logic */
const rowStride = (width: number, bitsPerPixel: number): number =>
  Math.ceil((width * bitsPerPixel) / 8);

export { rowStride };

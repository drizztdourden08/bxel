/* @layer renderer-app @kind logic */
import { SYMBOLS } from './demo-art.constants';

const artPixels = (rows: readonly string[], width: number, height: number): Uint8Array => {
  const pixels = new Uint8Array(width * height);
  rows.forEach((row, y) => {
    if (y >= height || row.length > width) throw new Error(`The art row ${y} does not fit ${width} by ${height}.`);
    [...row].forEach((symbol, x) => {
      const index = SYMBOLS.indexOf(symbol);
      if (index < 0) throw new Error(`The art symbol ${symbol} is not in the palette.`);
      pixels[y * width + x] = index;
    });
  });
  return pixels;
};

export { artPixels };

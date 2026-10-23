/* @layer core @kind logic */
import { parseHex } from './parse-hex';

const parsePalette = (palette: readonly string[], transparent: boolean): Int32Array => {
  const table = new Int32Array(palette.length);
  for (const [slot, text] of palette.entries()) {
    if (transparent && slot === 0) {
      table[slot] = -1;
      continue;
    }
    const rgb = parseHex(text);
    if (rgb === null) throw new Error(`INVALID_COLOR: slot ${slot} is not #rrggbb`);
    table[slot] = rgb;
  }
  return table;
};

export { parsePalette };

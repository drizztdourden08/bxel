/* @layer core @kind logic */
import { finishPalette } from './finish-palette';
import { formatHexColor } from './format-hex-color';
import type { PaletteColor, PaletteReadResult } from './palette-file.type';
import { paletteInvalid } from './palette-invalid';
import { parseHexColor } from './parse-hex-color';
import { readPaletteLines } from './read-palette-lines';

const readHex = (text: string): PaletteReadResult => {
  const colors: PaletteColor[] = [];
  for (const line of readPaletteLines(text)) {
    const rgba = parseHexColor(line);
    if (!rgba) return paletteInvalid(`Unreadable palette line: ${line}`);
    colors.push({ hex: formatHexColor(rgba[0] ?? 0, rgba[1] ?? 0, rgba[2] ?? 0, rgba[3] ?? 255), name: '' });
  }
  return finishPalette('', colors);
};

export { readHex };

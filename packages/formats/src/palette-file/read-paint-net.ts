/* @layer core @kind logic */
import { finishPalette } from './finish-palette';
import { formatHexColor } from './format-hex-color';
import { PAINT_NET } from './paint-net.constants';
import type { PaletteColor, PaletteReadResult } from './palette-file.type';
import { paletteInvalid } from './palette-invalid';
import { readPaletteLines } from './read-palette-lines';

const nameOf = (comment: string): string | undefined => {
  const body = comment.slice(PAINT_NET.COMMENT.length).trim();
  return body.startsWith(PAINT_NET.NAME_PREFIX) ? body.slice(PAINT_NET.NAME_PREFIX.length).trim() : undefined;
};

const colorOf = (line: string): PaletteColor => {
  const [a, r, g, b] = [0, 2, 4, 6].map((at) => Number.parseInt(line.slice(at, at + 2), 16));
  return { hex: formatHexColor(r ?? 0, g ?? 0, b ?? 0, a ?? 255), name: '' };
};

const readPaintNet = (text: string): PaletteReadResult => {
  let name = '';
  const colors: PaletteColor[] = [];
  for (const line of readPaletteLines(text)) {
    if (line.startsWith(PAINT_NET.COMMENT)) {
      name = nameOf(line) ?? name;
    } else if (PAINT_NET.LINE.test(line)) {
      colors.push(colorOf(line));
    } else {
      return paletteInvalid(`Unreadable palette line: ${line}`);
    }
  }
  return finishPalette(name, colors);
};

export { readPaintNet };

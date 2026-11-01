/* @layer core @kind logic */
import { isFormatFailure } from '../failure/is-format-failure';
import { cleanPaletteName } from './clean-palette-name';
import { PAINT_NET } from './paint-net.constants';
import type { PaletteFile, PaletteTextResult } from './palette-file.type';
import { parsePaletteColors } from './parse-palette-colors';

const pair = (value: number | undefined): string => (value ?? 0).toString(16).padStart(2, '0').toUpperCase();

const writePaintNet = (palette: PaletteFile): PaletteTextResult => {
  const parsed = parsePaletteColors(palette);
  if (isFormatFailure(parsed)) return parsed;
  const lines = [
    PAINT_NET.HEADER,
    `${PAINT_NET.COMMENT} ${PAINT_NET.NAME_PREFIX} ${cleanPaletteName(palette.name)}`,
    `${PAINT_NET.COMMENT} ${PAINT_NET.COLORS_PREFIX} ${parsed.length}`,
    ...parsed.map((rgba) => pair(rgba[3]) + pair(rgba[0]) + pair(rgba[1]) + pair(rgba[2])),
  ];
  return { ok: true, text: lines.join(PAINT_NET.BREAK) + PAINT_NET.BREAK };
};

export { writePaintNet };

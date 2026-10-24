/* @layer core @kind logic */
import { isFormatFailure } from '../failure/is-format-failure';
import type { PaletteFile, PaletteTextResult } from './palette-file.type';
import { PALETTE_LIMITS } from './palette-limits.constants';
import { parsePaletteColors } from './parse-palette-colors';

const writeJascPal = (palette: PaletteFile): PaletteTextResult => {
  const parsed = parsePaletteColors(palette);
  if (isFormatFailure(parsed)) return parsed;
  const lines = [
    PALETTE_LIMITS.JASC_HEADER,
    PALETTE_LIMITS.JASC_VERSION,
    String(parsed.length),
    ...parsed.map((rgba) => `${rgba[0] ?? 0} ${rgba[1] ?? 0} ${rgba[2] ?? 0}`),
  ];
  return { ok: true, text: lines.join(PALETTE_LIMITS.JASC_BREAK) + PALETTE_LIMITS.JASC_BREAK };
};

export { writeJascPal };

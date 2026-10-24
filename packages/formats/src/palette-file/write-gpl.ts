/* @layer core @kind logic */
import { isFormatFailure } from '../failure/is-format-failure';
import { cleanPaletteName } from './clean-palette-name';
import type { PaletteFile, PaletteTextResult } from './palette-file.type';
import { PALETTE_LIMITS } from './palette-limits.constants';
import { parsePaletteColors } from './parse-palette-colors';

const channel = (value: number | undefined): string => String(value ?? 0).padStart(3, ' ');

const writeGpl = (palette: PaletteFile): PaletteTextResult => {
  const parsed = parsePaletteColors(palette);
  if (isFormatFailure(parsed)) return parsed;
  const lines: string[] = [
    PALETTE_LIMITS.GPL_HEADER,
    `Name: ${cleanPaletteName(palette.name)}`,
    `Columns: ${PALETTE_LIMITS.GPL_COLUMNS}`,
    '#',
  ];
  parsed.forEach((rgba, i) => {
    const name = cleanPaletteName(palette.colors[i]?.name ?? '');
    lines.push(`${channel(rgba[0])} ${channel(rgba[1])} ${channel(rgba[2])}${name === '' ? '' : `\t${name}`}`);
  });
  return { ok: true, text: lines.join(PALETTE_LIMITS.GPL_BREAK) + PALETTE_LIMITS.GPL_BREAK };
};

export { writeGpl };

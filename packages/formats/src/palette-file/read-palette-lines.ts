/* @layer core @kind logic */
import { LINE_BREAK_PATTERN } from './line-break-pattern.constants';
import { PALETTE_LIMITS } from './palette-limits.constants';

const readPaletteLines = (text: string): string[] =>
  text
    .replace(PALETTE_LIMITS.BOM, '')
    .split(LINE_BREAK_PATTERN)
    .map((line) => line.trim())
    .filter((line) => line !== '');

export { readPaletteLines };

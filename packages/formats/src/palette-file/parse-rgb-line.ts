/* @layer core @kind logic */
import { formatHexColor } from './format-hex-color';
import type { PaletteColor } from './palette-file.type';
import { RGB_LINE_PATTERN } from './rgb-line-pattern.constants';

const parseRgbLine = (line: string): PaletteColor | undefined => {
  const match = RGB_LINE_PATTERN.exec(line.trim());
  if (!match) return undefined;
  const [r = 256, g = 256, b = 256] = [1, 2, 3].map((i) => Number(match[i]));
  if (r > 255 || g > 255 || b > 255) return undefined;
  return { hex: formatHexColor(r, g, b, 255), name: (match[4] ?? '').trim() };
};

export { parseRgbLine };

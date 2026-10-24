/* @layer core @kind logic */
import { HEX_COLOR_PATTERN } from './hex-color-pattern.constants';

const parseHexColor = (hex: string): number[] | undefined => {
  const match = HEX_COLOR_PATTERN.exec(hex);
  if (!match) return undefined;
  const alpha = match[4];
  return [1, 2, 3].map((i) => Number.parseInt(match[i] ?? '0', 16)).concat(alpha === undefined ? 255 : Number.parseInt(alpha, 16));
};

export { parseHexColor };

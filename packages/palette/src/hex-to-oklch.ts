/* @layer core @kind logic */
import type { Oklch } from './oklab.type';
import { oklabToOklch } from './oklab-to-oklch';
import { parseHex } from './parse-hex';
import { rgbToOklab } from './rgb-to-oklab';

const hexToOklch = (hex: string): Oklch | null => {
  const rgb = parseHex(hex.slice(0, 7));
  return rgb === null ? null : oklabToOklch(rgbToOklab(rgb));
};

export { hexToOklch };

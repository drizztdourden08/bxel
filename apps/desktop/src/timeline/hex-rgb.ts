/* @layer renderer-app @kind logic */
import { FALLBACK } from './hex-rgb.constants';
import type { Rgb } from './onion.type';

const hexRgb = (hex: string): Rgb => {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  const digits = match?.[1];
  if (digits === undefined) return FALLBACK;
  const value = Number.parseInt(digits, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

export { hexRgb };

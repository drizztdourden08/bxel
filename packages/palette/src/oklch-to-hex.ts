/* @layer core @kind logic */
import { formatHex } from './format-hex';
import type { Oklch } from './oklab.type';
import { oklchToRgb } from './oklch-to-rgb';

const oklchToHex = (colour: Oklch): string => formatHex(oklchToRgb(colour));

export { oklchToHex };

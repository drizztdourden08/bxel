/* @layer core @kind constants */
import type { PaletteSortKey } from './palette-sort.type';

const PALETTE_SORT_KEYS: readonly PaletteSortKey[] = ['lightness', 'luminance', 'hue', 'chroma', 'name', 'use', 'ramp'];

const GREY_CHROMA = 0.02;

const LUMINANCE_WEIGHTS = [0.2126, 0.7152, 0.0722] as const;

const RAMP_RANK_STRIDE = 1024;

export { GREY_CHROMA, LUMINANCE_WEIGHTS, PALETTE_SORT_KEYS, RAMP_RANK_STRIDE };

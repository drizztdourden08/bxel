/* @layer core @kind logic */
import type { Oklab } from './oklab.type';

const oklabDistance = (first: Oklab, second: Oklab): number => Math.hypot(first.l - second.l, first.a - second.a, first.b - second.b);

export { oklabDistance };

/* @layer core @kind logic */
import type { Swatch } from '../model/palette.type';
import { MIN_ALPHA, OPAQUE_ALPHA } from '../model/transparent.constants';

const swatchAlpha = (slot: Swatch): number => (slot.kind === 'transparent' ? MIN_ALPHA : (slot.alpha ?? OPAQUE_ALPHA));

export { swatchAlpha };

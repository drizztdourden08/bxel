/* @layer core @kind logic */
import type { Rgb } from '../model/palette.type';
import { OPAQUE_ALPHA } from '../model/transparent.constants';

const swatchFields = (rgb: Rgb, alpha: number | undefined): { readonly rgb: Rgb; readonly alpha?: number } =>
  alpha === undefined || alpha === OPAQUE_ALPHA ? { rgb } : { rgb, alpha };

export { swatchFields };

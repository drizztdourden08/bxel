/* @layer core @kind logic */
import { OPAQUE_ALPHA } from '../model/transparent.constants';
import type { Rgb } from '../model/palette.type';

const formatSwatchColor = (rgb: Rgb, alpha: number | undefined): string =>
  alpha === undefined || alpha === OPAQUE_ALPHA ? rgb : `${rgb}${alpha.toString(16).padStart(2, '0')}`;

export { formatSwatchColor };

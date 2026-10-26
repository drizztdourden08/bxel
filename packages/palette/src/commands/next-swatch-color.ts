/* @layer core @kind logic */
import { OPAQUE_ALPHA } from '@bxel/document';
import type { Swatch, SwatchColorValue } from '@bxel/document';
import { checkColor } from './check-color';
import { ALPHA_DIGITS_LENGTH } from './next-swatch-color.constants';
import type { SwatchUpdateOptions } from './swatch-update.type';

const nextSwatchColor = (options: SwatchUpdateOptions, slot: Extract<Swatch, { kind: 'color' }>): SwatchColorValue => {
  const kept = slot.alpha ?? OPAQUE_ALPHA;
  if (options.rgb === undefined) return { rgb: slot.rgb, alpha: options.alpha ?? kept };
  const parsed = checkColor(options.rgb, 'options.rgb');
  const given = options.rgb.length === ALPHA_DIGITS_LENGTH;
  return { rgb: parsed.rgb, alpha: options.alpha ?? (given ? parsed.alpha : kept) };
};

export { nextSwatchColor };

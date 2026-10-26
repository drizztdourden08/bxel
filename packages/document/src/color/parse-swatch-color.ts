/* @layer core @kind logic */
import { COLOR_PATTERN, OPAQUE_ALPHA } from '../model/transparent.constants';
import type { SwatchColorValue } from './parse-swatch-color.type';

const parseSwatchColor = (text: string): SwatchColorValue | null => {
  const match = COLOR_PATTERN.exec(text);
  if (!match) return null;
  const rgb: SwatchColorValue['rgb'] = `#${(match[1] ?? '').toLowerCase()}`;
  return { rgb, alpha: match[2] === undefined ? OPAQUE_ALPHA : Number.parseInt(match[2], 16) };
};

export { parseSwatchColor };

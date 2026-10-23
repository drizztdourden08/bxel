/* @layer core @kind logic */
import { HEX_COLOR_PATTERN } from './hex-color.constants';

const parseHex = (text: string): number | null =>
  HEX_COLOR_PATTERN.test(text) ? Number.parseInt(text.slice(1), 16) : null;

export { parseHex };

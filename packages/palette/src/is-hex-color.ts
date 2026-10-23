/* @layer core @kind logic */
import { parseHex } from './parse-hex';

const isHexColor = (value: unknown): value is string =>
  typeof value === 'string' && parseHex(value) !== null;

export { isHexColor };

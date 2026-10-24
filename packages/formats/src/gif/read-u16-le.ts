/* @layer core @kind logic */
import { byteAt } from '../pixels/byte-at';

const readU16Le = (bytes: Uint8Array, offset: number): number =>
  byteAt(bytes, offset) | (byteAt(bytes, offset + 1) << 8);

export { readU16Le };

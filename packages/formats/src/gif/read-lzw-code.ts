/* @layer core @kind logic */
import { byteAt } from '../pixels/byte-at';
import type { LzwReader } from './gif.type';

const readLzwCode = (reader: LzwReader, width: number): number => {
  while (reader.bits < width) {
    if (reader.pos >= reader.data.length) return -1;
    reader.acc |= byteAt(reader.data, reader.pos) << reader.bits;
    reader.pos += 1;
    reader.bits += 8;
  }
  const code = reader.acc & ((1 << width) - 1);
  reader.acc >>>= width;
  reader.bits -= width;
  return code;
};

export { readLzwCode };

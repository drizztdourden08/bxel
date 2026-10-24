/* @layer core @kind logic */
import type { BitWriter } from './gif.type';

const emitBits = (writer: BitWriter, code: number, width: number): void => {
  writer.acc |= code << writer.bits;
  writer.bits += width;
  while (writer.bits >= 8) {
    writer.bytes.push(writer.acc & 0xff);
    writer.acc >>>= 8;
    writer.bits -= 8;
  }
};

export { emitBits };

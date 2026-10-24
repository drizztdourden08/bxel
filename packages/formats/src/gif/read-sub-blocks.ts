/* @layer core @kind logic */
import { byteAt } from '../pixels/byte-at';
import { concatBytes } from '../concat-bytes';
import type { ByteReader } from './gif.type';

const readSubBlocks = (reader: ByteReader): Uint8Array | undefined => {
  const parts: Uint8Array[] = [];
  while (reader.pos < reader.bytes.length) {
    const size = byteAt(reader.bytes, reader.pos);
    reader.pos += 1;
    if (size === 0) return concatBytes(parts);
    if (reader.pos + size > reader.bytes.length) return undefined;
    parts.push(reader.bytes.subarray(reader.pos, reader.pos + size));
    reader.pos += size;
  }
  return undefined;
};

export { readSubBlocks };

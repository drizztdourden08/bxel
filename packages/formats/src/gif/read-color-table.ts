/* @layer core @kind logic */
import type { ByteReader } from './gif.type';

const readColorTable = (reader: ByteReader, length: number): Uint8Array | undefined => {
  if (length === 0 || reader.pos + length > reader.bytes.length) return undefined;
  const table = reader.bytes.subarray(reader.pos, reader.pos + length);
  reader.pos += length;
  return table;
};

export { readColorTable };

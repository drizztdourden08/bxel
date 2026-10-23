/* @layer core @kind logic */
import { crc32 } from './crc32';
import { PNG_LAYOUT } from './png-layout.constants';
import { writeU32 } from './write-u32';

const writePngChunk = (type: string, data: Uint8Array): Uint8Array => {
  const { CHUNK_OVERHEAD, TYPE_OFFSET, DATA_OFFSET } = PNG_LAYOUT;
  const chunk = new Uint8Array(CHUNK_OVERHEAD + data.length);
  writeU32(chunk, 0, data.length);
  for (let i = 0; i < TYPE_OFFSET; i += 1) chunk[TYPE_OFFSET + i] = type.charCodeAt(i);
  chunk.set(data, DATA_OFFSET);
  const end = DATA_OFFSET + data.length;
  writeU32(chunk, end, crc32(chunk.subarray(TYPE_OFFSET, end)));
  return chunk;
};

export { writePngChunk };

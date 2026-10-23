/* @layer core @kind logic */
import { crc32 } from './crc32';
import { writeU32 } from './write-u32';

const CHUNK_OVERHEAD = 12;
const TYPE_OFFSET = 4;
const DATA_OFFSET = 8;

const writePngChunk = (type: string, data: Uint8Array): Uint8Array => {
  const chunk = new Uint8Array(CHUNK_OVERHEAD + data.length);
  writeU32(chunk, 0, data.length);
  for (let i = 0; i < TYPE_OFFSET; i += 1) chunk[TYPE_OFFSET + i] = type.charCodeAt(i);
  chunk.set(data, DATA_OFFSET);
  const end = DATA_OFFSET + data.length;
  writeU32(chunk, end, crc32(chunk.subarray(TYPE_OFFSET, end)));
  return chunk;
};

export { writePngChunk };

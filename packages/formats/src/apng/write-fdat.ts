/* @layer core @kind logic */
import { writePngChunk } from '../write-png-chunk';
import { writeU32 } from '../write-u32';
import { APNG_CHUNK } from './apng-chunk.constants';
import { APNG_LIMITS } from './apng-limits.constants';

const writeFdat = (sequence: number, compressed: Uint8Array): Uint8Array => {
  const data = new Uint8Array(APNG_LIMITS.SEQUENCE_LENGTH + compressed.length);
  writeU32(data, 0, sequence);
  data.set(compressed, APNG_LIMITS.SEQUENCE_LENGTH);
  return writePngChunk(APNG_CHUNK.FDAT, data);
};

export { writeFdat };

/* @layer core @kind logic */
import { writePngChunk } from '../write-png-chunk';
import { writeU32 } from '../write-u32';
import { APNG_CHUNK } from './apng-chunk.constants';
import { APNG_LIMITS } from './apng-limits.constants';

const writeActl = (frames: number, loops: number): Uint8Array => {
  const data = new Uint8Array(APNG_LIMITS.ACTL_LENGTH);
  writeU32(data, 0, frames);
  writeU32(data, 4, loops);
  return writePngChunk(APNG_CHUNK.ACTL, data);
};

export { writeActl };

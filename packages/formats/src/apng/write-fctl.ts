/* @layer core @kind logic */
import { writePngChunk } from '../write-png-chunk';
import { writeU32 } from '../write-u32';
import { APNG_CHUNK } from './apng-chunk.constants';
import { APNG_LIMITS } from './apng-limits.constants';
import { writeU16Be } from './write-u16-be';

const writeFctl = (
  sequence: number,
  size: { readonly width: number; readonly height: number },
  delayMs: number,
): Uint8Array => {
  const data = new Uint8Array(APNG_LIMITS.FCTL_LENGTH);
  writeU32(data, 0, sequence);
  writeU32(data, 4, size.width);
  writeU32(data, 8, size.height);
  writeU16Be(data, 20, delayMs);
  writeU16Be(data, 22, APNG_LIMITS.DELAY_DEN);
  return writePngChunk(APNG_CHUNK.FCTL, data);
};

export { writeFctl };

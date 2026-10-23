/* @layer core @kind logic */
import { zlibSync } from 'fflate';
import { concatBytes } from './concat-bytes';
import { PNG_CHUNK } from './png-chunk.constants';
import { PNG_SIGNATURE } from './png-signature.constants';
import { writePngChunk } from './write-png-chunk';
import { writeU32 } from './write-u32';

type PngParts = {
  readonly width: number;
  readonly height: number;
  readonly bitDepth: number;
  readonly colorType: number;
  readonly extra: readonly Uint8Array[];
  readonly filtered: Uint8Array;
};

const COMPRESSION_LEVEL = 9;
const IHDR_LENGTH = 13;

const buildIhdr = (parts: PngParts): Uint8Array => {
  const ihdr = new Uint8Array(IHDR_LENGTH);
  writeU32(ihdr, 0, parts.width);
  writeU32(ihdr, 4, parts.height);
  ihdr[8] = parts.bitDepth;
  ihdr[9] = parts.colorType;
  return ihdr;
};

const assemblePng = (parts: PngParts): Uint8Array =>
  concatBytes([
    PNG_SIGNATURE,
    writePngChunk(PNG_CHUNK.IHDR, buildIhdr(parts)),
    ...parts.extra,
    writePngChunk(PNG_CHUNK.IDAT, zlibSync(parts.filtered, { level: COMPRESSION_LEVEL })),
    writePngChunk(PNG_CHUNK.IEND, new Uint8Array(0)),
  ]);

export { assemblePng };

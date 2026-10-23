/* @layer core @kind logic */
import { zlibSync } from 'fflate';
import { concatBytes } from './concat-bytes';
import { PNG_CHUNK } from './png-chunk.constants';
import { PNG_ENCODE } from './png-encode.constants';
import { PNG_LAYOUT } from './png-layout.constants';
import { PNG_SIGNATURE } from './png-signature.constants';
import type { PngParts } from './png.type';
import { writePngChunk } from './write-png-chunk';
import { writeU32 } from './write-u32';

const buildIhdr = (parts: PngParts): Uint8Array => {
  const ihdr = new Uint8Array(PNG_LAYOUT.IHDR_LENGTH);
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
    writePngChunk(PNG_CHUNK.IDAT, zlibSync(parts.filtered, { level: PNG_ENCODE.COMPRESSION_LEVEL })),
    writePngChunk(PNG_CHUNK.IEND, new Uint8Array(0)),
  ]);

export { assemblePng };

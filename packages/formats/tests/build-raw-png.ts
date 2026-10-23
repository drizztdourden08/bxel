/* @layer tests @kind helper */
import { PNG_CHUNK, PNG_SIGNATURE, writePngChunk } from '@bxel/formats';
import { zlibSync } from 'fflate';

type RawPngSpec = {
  readonly width: number;
  readonly height: number;
  readonly colorType: number;
  readonly bitDepth: number;
  readonly scanlines: readonly number[];
  readonly before?: readonly Uint8Array[];
  readonly interlace?: number;
};

const u32 = (value: number): number[] => [
  (value >>> 24) & 0xff,
  (value >>> 16) & 0xff,
  (value >>> 8) & 0xff,
  value & 0xff,
];

const buildRawPng = (spec: RawPngSpec): Uint8Array => {
  const ihdr = new Uint8Array([
    ...u32(spec.width),
    ...u32(spec.height),
    spec.bitDepth,
    spec.colorType,
    0,
    0,
    spec.interlace ?? 0,
  ]);
  const parts = [
    PNG_SIGNATURE,
    writePngChunk(PNG_CHUNK.IHDR, ihdr),
    ...(spec.before ?? []),
    writePngChunk(PNG_CHUNK.IDAT, zlibSync(new Uint8Array(spec.scanlines))),
    writePngChunk(PNG_CHUNK.IEND, new Uint8Array(0)),
  ];
  const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
};

export { buildRawPng };

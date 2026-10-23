/* @layer tests @kind test */
import {
  decodePng,
  encodePngIndexed,
  encodePngRgba,
  PNG_CHUNK,
  PNG_COLOR_TYPE,
  PNG_ERROR_CODE,
  writePngChunk,
} from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { buildRawPng } from './build-raw-png';
import { makeGradient } from './make-gradient';

const IDAT_DATA_OFFSET = 41;

const validPng = (): Uint8Array => {
  const result = encodePngRgba(makeGradient(4, 4));
  if (!result.ok) throw new Error(result.message);
  return result.bytes;
};

const codeOf = (bytes: Uint8Array): string => {
  const result = decodePng(bytes);
  return result.ok ? 'OK' : result.code;
};

describe('decodePng damaged files', () => {
  it('rejects a bad signature', () => {
    const bytes = validPng();
    bytes[1] = 0;
    expect(codeOf(bytes)).toBe(PNG_ERROR_CODE.PNG_INVALID_SIGNATURE);
    expect(codeOf(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]))).toBe(
      PNG_ERROR_CODE.PNG_INVALID_SIGNATURE,
    );
  });

  it('reports a corrupted chunk as a checksum failure', () => {
    const bytes = validPng();
    bytes[IDAT_DATA_OFFSET] = (bytes[IDAT_DATA_OFFSET] ?? 0) ^ 0xff;
    const result = decodePng(bytes);
    expect(!result.ok && result.code).toBe(PNG_ERROR_CODE.PNG_CHECKSUM);
  });

  it('reports a corrupted IHDR as a checksum failure', () => {
    const bytes = validPng();
    bytes[16] = (bytes[16] ?? 0) ^ 1;
    expect(codeOf(bytes)).toBe(PNG_ERROR_CODE.PNG_CHECKSUM);
  });

  it('reports truncation at every cut point', () => {
    const bytes = validPng();
    const cuts = [0, 4, 8, 12, 20, 33, 45, bytes.length - 13, bytes.length - 1];
    for (const cut of cuts) {
      expect(codeOf(bytes.subarray(0, cut))).toBe(PNG_ERROR_CODE.PNG_TRUNCATED);
    }
  });

});

describe('decodePng unsupported and oversize files', () => {
  it('reports Adam7 as unsupported', () => {
    const bytes = buildRawPng({
      width: 1,
      height: 1,
      colorType: PNG_COLOR_TYPE.GRAY,
      bitDepth: 8,
      scanlines: [0, 1],
      interlace: 1,
    });
    expect(codeOf(bytes)).toBe(PNG_ERROR_CODE.PNG_UNSUPPORTED);
  });

  it('reports an unknown critical chunk as unsupported', () => {
    const bytes = buildRawPng({
      width: 1,
      height: 1,
      colorType: PNG_COLOR_TYPE.GRAY,
      bitDepth: 8,
      scanlines: [0, 1],
      before: [writePngChunk('ABCD', new Uint8Array(1))],
    });
    expect(codeOf(bytes)).toBe(PNG_ERROR_CODE.PNG_UNSUPPORTED);
  });

  it('limits the import size to 4096 per side', () => {
    const wide = buildRawPng({
      width: 4097,
      height: 1,
      colorType: PNG_COLOR_TYPE.GRAY,
      bitDepth: 8,
      scanlines: [],
    });
    const tall = buildRawPng({
      width: 1,
      height: 5000,
      colorType: PNG_COLOR_TYPE.GRAY,
      bitDepth: 8,
      scanlines: [],
    });
    expect(codeOf(wide)).toBe(PNG_ERROR_CODE.PNG_TOO_LARGE);
    expect(codeOf(tall)).toBe(PNG_ERROR_CODE.PNG_TOO_LARGE);
  });

  it('accepts exactly 4096 per side limit as a header', () => {
    const bytes = buildRawPng({
      width: 4096,
      height: 1,
      colorType: PNG_COLOR_TYPE.GRAY,
      bitDepth: 8,
      scanlines: [],
    });
    expect(codeOf(bytes)).toBe(PNG_ERROR_CODE.PNG_TRUNCATED);
  });

});

describe('decodePng invalid data', () => {
  it('rejects zero size, bad depth and bad colour type', () => {
    const base = { height: 1, scanlines: [0, 1] };
    const zero = buildRawPng({ ...base, width: 0, colorType: 0, bitDepth: 8 });
    const depth = buildRawPng({ ...base, width: 1, colorType: 2, bitDepth: 4 });
    const colour = buildRawPng({ ...base, width: 1, colorType: 5, bitDepth: 8 });
    expect([codeOf(zero), codeOf(depth), codeOf(colour)]).toEqual(
      Array.from({ length: 3 }, () => PNG_ERROR_CODE.PNG_INVALID_DATA),
    );
  });

  it('rejects an unknown filter type', () => {
    const bytes = buildRawPng({
      width: 1,
      height: 1,
      colorType: PNG_COLOR_TYPE.GRAY,
      bitDepth: 8,
      scanlines: [9, 1],
    });
    expect(codeOf(bytes)).toBe(PNG_ERROR_CODE.PNG_INVALID_DATA);
  });

  it('rejects an indexed file without PLTE or with an index outside it', () => {
    const base = {
      width: 1,
      height: 1,
      colorType: PNG_COLOR_TYPE.INDEXED,
      bitDepth: 8,
      scanlines: [0, 5],
    };
    const missing = buildRawPng(base);
    const outside = buildRawPng({
      ...base,
      before: [writePngChunk(PNG_CHUNK.PLTE, new Uint8Array([1, 2, 3]))],
    });
    expect(codeOf(missing)).toBe(PNG_ERROR_CODE.PNG_INVALID_DATA);
    expect(codeOf(outside)).toBe(PNG_ERROR_CODE.PNG_INVALID_DATA);
  });

  it('reports image data with too few rows as truncated', () => {
    const bytes = buildRawPng({
      width: 2,
      height: 3,
      colorType: PNG_COLOR_TYPE.GRAY,
      bitDepth: 8,
      scanlines: [0, 1, 2],
    });
    expect(codeOf(bytes)).toBe(PNG_ERROR_CODE.PNG_TRUNCATED);
  });

});

describe('decodePng on flipped bits', () => {
  it('never throws when any single bit of a valid file is flipped', () => {
    const indexed = encodePngIndexed({
      indices: new Uint8Array([0, 1, 1, 0]),
      palette: new Uint8Array([0, 0, 0, 0, 9, 9, 9, 255]),
      width: 2,
      height: 2,
    });
    const bytes = indexed.ok ? indexed.bytes : new Uint8Array(0);
    for (let at = 0; at < bytes.length; at += 1) {
      for (let bit = 0; bit < 8; bit += 1) {
        const copy = bytes.slice();
        copy[at] = (copy[at] ?? 0) ^ (1 << bit);
        expect(() => decodePng(copy)).not.toThrow();
      }
    }
  });

  it('decodes an unmodified copy of the same file', () => {
    expect(codeOf(validPng())).toBe('OK');
  });
});

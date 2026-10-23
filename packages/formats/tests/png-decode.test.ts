/* @layer tests @kind test */
import { PNG_CHUNK, PNG_COLOR_TYPE, writePngChunk } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { buildRawPng } from './build-raw-png';
import { expectDecoded } from './expect-decoded';

const chunk = (type: string, ...data: number[]): Uint8Array =>
  writePngChunk(type, new Uint8Array(data));

describe('decodePng gray bit depths', () => {
  it('decodes every filter type', () => {
    const bytes = buildRawPng({
      width: 2,
      height: 5,
      colorType: PNG_COLOR_TYPE.GRAY,
      bitDepth: 8,
      scanlines: [0, 7, 9, 1, 10, 5, 2, 1, 2, 3, 5, 3, 4, 2, 4],
    });
    const gray = [7, 9, 10, 15, 11, 17, 10, 16, 12, 20];
    const expected = gray.flatMap((value) => [value, value, value, 255]);
    expect(expectDecoded(bytes).data).toEqual(expected);
  });

  it('decodes 1 bit gray', () => {
    const bytes = buildRawPng({
      width: 3,
      height: 1,
      colorType: PNG_COLOR_TYPE.GRAY,
      bitDepth: 1,
      scanlines: [0, 0b10100000],
    });
    expect(expectDecoded(bytes).data.filter((_, i) => i % 4 === 0)).toEqual([255, 0, 255]);
  });

  it('decodes 2 bit gray', () => {
    const bytes = buildRawPng({
      width: 4,
      height: 1,
      colorType: PNG_COLOR_TYPE.GRAY,
      bitDepth: 2,
      scanlines: [0, 0b00011011],
    });
    expect(expectDecoded(bytes).data.filter((_, i) => i % 4 === 0)).toEqual([0, 85, 170, 255]);
  });

  it('decodes 4 bit gray with a padded row', () => {
    const bytes = buildRawPng({
      width: 3,
      height: 1,
      colorType: PNG_COLOR_TYPE.GRAY,
      bitDepth: 4,
      scanlines: [0, 0x0f, 0x50],
    });
    expect(expectDecoded(bytes).data.filter((_, i) => i % 4 === 0)).toEqual([0, 255, 85]);
  });

});

describe('decodePng gray, alpha and rgb', () => {
  it('reduces 16 bit gray to the high byte', () => {
    const bytes = buildRawPng({
      width: 2,
      height: 1,
      colorType: PNG_COLOR_TYPE.GRAY,
      bitDepth: 16,
      scanlines: [0, 0x12, 0x34, 0xff, 0x00],
    });
    expect(expectDecoded(bytes).data).toEqual([0x12, 0x12, 0x12, 255, 255, 255, 255, 255]);
  });

  it('applies tRNS to gray', () => {
    const bytes = buildRawPng({
      width: 2,
      height: 1,
      colorType: PNG_COLOR_TYPE.GRAY,
      bitDepth: 8,
      scanlines: [0, 10, 20],
      before: [chunk(PNG_CHUNK.TRNS, 0, 10)],
    });
    expect(expectDecoded(bytes).data).toEqual([10, 10, 10, 0, 20, 20, 20, 255]);
  });

  it('decodes gray with alpha', () => {
    const bytes = buildRawPng({
      width: 2,
      height: 1,
      colorType: PNG_COLOR_TYPE.GRAY_ALPHA,
      bitDepth: 8,
      scanlines: [0, 10, 20, 30, 40],
    });
    expect(expectDecoded(bytes).data).toEqual([10, 10, 10, 20, 30, 30, 30, 40]);
  });

  it('decodes 8 bit and 16 bit rgb', () => {
    const eight = buildRawPng({
      width: 1,
      height: 1,
      colorType: PNG_COLOR_TYPE.RGB,
      bitDepth: 8,
      scanlines: [0, 1, 2, 3],
    });
    const sixteen = buildRawPng({
      width: 1,
      height: 1,
      colorType: PNG_COLOR_TYPE.RGB,
      bitDepth: 16,
      scanlines: [0, 1, 2, 3, 4, 5, 6],
    });
    expect(expectDecoded(eight).data).toEqual([1, 2, 3, 255]);
    expect(expectDecoded(sixteen).data).toEqual([1, 3, 5, 255]);
  });

});

describe('decodePng transparency, rgba and indexed', () => {
  it('applies tRNS to rgb', () => {
    const bytes = buildRawPng({
      width: 2,
      height: 1,
      colorType: PNG_COLOR_TYPE.RGB,
      bitDepth: 8,
      scanlines: [0, 1, 2, 3, 1, 2, 4],
      before: [chunk(PNG_CHUNK.TRNS, 0, 1, 0, 2, 0, 3)],
    });
    expect(expectDecoded(bytes).data).toEqual([1, 2, 3, 0, 1, 2, 4, 255]);
  });

  it('decodes rgba at 8 and 16 bit', () => {
    const eight = buildRawPng({
      width: 1,
      height: 1,
      colorType: PNG_COLOR_TYPE.RGBA,
      bitDepth: 8,
      scanlines: [0, 9, 8, 7, 6],
    });
    const sixteen = buildRawPng({
      width: 1,
      height: 1,
      colorType: PNG_COLOR_TYPE.RGBA,
      bitDepth: 16,
      scanlines: [0, 0x11, 0, 0x22, 0, 0x33, 0, 0x44, 0],
    });
    expect(expectDecoded(eight).data).toEqual([9, 8, 7, 6]);
    expect(expectDecoded(sixteen).data).toEqual([0x11, 0x22, 0x33, 0x44]);
  });

  it('decodes indexed with a partial tRNS', () => {
    const bytes = buildRawPng({
      width: 3,
      height: 1,
      colorType: PNG_COLOR_TYPE.INDEXED,
      bitDepth: 2,
      scanlines: [0, 0b00011000],
      before: [chunk(PNG_CHUNK.PLTE, 1, 2, 3, 4, 5, 6, 7, 8, 9), chunk(PNG_CHUNK.TRNS, 0, 128)],
    });
    expect(expectDecoded(bytes).data).toEqual([1, 2, 3, 0, 4, 5, 6, 128, 7, 8, 9, 255]);
  });

  it('ignores unknown ancillary chunks', () => {
    const bytes = buildRawPng({
      width: 1,
      height: 1,
      colorType: PNG_COLOR_TYPE.GRAY,
      bitDepth: 8,
      scanlines: [0, 5],
      before: [chunk('teXt', 1, 2, 3)],
    });
    expect(expectDecoded(bytes).data).toEqual([5, 5, 5, 255]);
  });
});

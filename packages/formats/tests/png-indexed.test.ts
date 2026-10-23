/* @layer tests @kind test */
import { encodePngIndexed, PNG_ERROR_CODE } from '@bxel/formats';
import type { IndexedImage } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { expectDecoded } from './expect-decoded';
import { filterBytes } from './filter-bytes';
import { listChunks } from './list-chunks';

const BIT_DEPTH_OFFSET = 24;

const makePalette = (entries: number, firstAlpha = 255): Uint8Array => {
  const palette = new Uint8Array(entries * 4);
  for (let i = 0; i < entries; i += 1) {
    palette.set([i * 3, 255 - i, (i * 17) & 255, i === 0 ? firstAlpha : 255], i * 4);
  }
  return palette;
};

const makeIndexed = (entries: number, width: number, height: number, alpha = 255): IndexedImage => {
  const indices = new Uint8Array(width * height);
  for (let i = 0; i < indices.length; i += 1) indices[i] = (i * 7 + 3) % entries;
  return { indices, palette: makePalette(entries, alpha), width, height };
};

const encodeOk = (...args: Parameters<typeof encodePngIndexed>): Uint8Array => {
  const result = encodePngIndexed(...args);
  if (!result.ok) throw new Error(result.message);
  return result.bytes;
};

const expected = (image: IndexedImage): number[] =>
  Array.from(image.indices).flatMap((index) =>
    Array.from(image.palette.subarray(index * 4, index * 4 + 4)),
  );

describe('encodePngIndexed round trips', () => {
  it.each([
    [1, 1],
    [2, 1],
    [3, 2],
    [4, 2],
    [5, 4],
    [16, 4],
    [17, 8],
    [256, 8],
  ])('round trips %i palette entries at bit depth %i', (entries, depth) => {
    const image = makeIndexed(entries, 13, 5);
    const bytes = encodeOk(image);
    expect(bytes[BIT_DEPTH_OFFSET]).toBe(depth);
    const decoded = expectDecoded(bytes);
    expect(decoded.width).toBe(13);
    expect(decoded.data).toEqual(expected(image));
  });

  it.each([0, 1, 2, 3, 4] as const)('round trips packed rows with filter %i', (filter) => {
    const image = makeIndexed(11, 10, 7);
    const bytes = encodeOk(image, { filter });
    expect(filterBytes(bytes, 5, 7)).toEqual(Array.from({ length: 7 }, () => filter));
    expect(expectDecoded(bytes).data).toEqual(expected(image));
  });

});

describe('encodePngIndexed transparency and rejections', () => {
  it('writes tRNS for a transparent entry 0 and decodes the alpha', () => {
    const image = makeIndexed(4, 6, 4, 0);
    const bytes = encodeOk(image);
    const chunks = listChunks(bytes);
    expect(chunks.map((chunk) => chunk.type)).toEqual(['IHDR', 'PLTE', 'tRNS', 'IDAT', 'IEND']);
    expect(Array.from(chunks[2]?.data ?? [])).toEqual([0]);
    expect(chunks[1]?.data.length).toBe(12);
    const decoded = expectDecoded(bytes);
    expect(decoded.data).toEqual(expected(image));
    expect(decoded.data[3]).toBe(image.indices[0] === 0 ? 0 : 255);
  });

  it('trims tRNS after the last non opaque entry', () => {
    const palette = makePalette(5);
    palette[7] = 10;
    palette[11] = 255;
    const indices = new Uint8Array([0, 1, 2, 3, 4, 1]);
    const bytes = encodeOk({ indices, palette, width: 3, height: 2 });
    const trns = listChunks(bytes).find((chunk) => chunk.type === 'tRNS');
    expect(Array.from(trns?.data ?? [])).toEqual([255, 10]);
  });

  it('omits tRNS for an opaque palette', () => {
    const bytes = encodeOk(makeIndexed(8, 4, 4));
    expect(listChunks(bytes).some((chunk) => chunk.type === 'tRNS')).toBe(false);
  });

  it('writes the same bytes for the same input', () => {
    const a = encodeOk(makeIndexed(16, 12, 12, 0));
    const b = encodeOk(makeIndexed(16, 12, 12, 0));
    expect(Array.from(a)).toEqual(Array.from(b));
  });

  it('rejects an index outside the palette', () => {
    const image = { ...makeIndexed(4, 2, 2), indices: new Uint8Array([0, 1, 2, 4]) };
    const result = encodePngIndexed(image);
    expect(!result.ok && result.code).toBe(PNG_ERROR_CODE.PNG_INVALID_INPUT);
  });

  it('rejects an empty or oversized palette', () => {
    const none = encodePngIndexed({ ...makeIndexed(2, 1, 1), palette: new Uint8Array(0) });
    const big = encodePngIndexed({ ...makeIndexed(2, 1, 1), palette: makePalette(257) });
    const ragged = encodePngIndexed({ ...makeIndexed(2, 1, 1), palette: new Uint8Array(7) });
    expect([none.ok, big.ok, ragged.ok]).toEqual([false, false, false]);
  });

  it('rejects an index buffer that does not match the size', () => {
    const result = encodePngIndexed({ ...makeIndexed(2, 2, 2), width: 3 });
    expect(result.ok).toBe(false);
  });
});

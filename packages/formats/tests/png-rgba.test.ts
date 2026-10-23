/* @layer tests @kind test */
import { encodePngRgba, PNG_ERROR_CODE, PNG_FILTER, PNG_SIGNATURE } from '@bxel/formats';
import type { PngFilterType } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { expectDecoded } from './expect-decoded';
import { filterBytes } from './filter-bytes';
import { listChunks } from './list-chunks';
import { makeGradient } from './make-gradient';

const encodeOk = (...args: Parameters<typeof encodePngRgba>): Uint8Array => {
  const result = encodePngRgba(...args);
  if (!result.ok) throw new Error(result.message);
  return result.bytes;
};

describe('encodePngRgba', () => {
  it('round trips a gradient with the adaptive filter', () => {
    const image = makeGradient(7, 5);
    const decoded = expectDecoded(encodeOk(image));
    expect(decoded.width).toBe(7);
    expect(decoded.height).toBe(5);
    expect(decoded.data).toEqual(Array.from(image.data));
  });

  it('round trips a single pixel', () => {
    const image = { data: new Uint8ClampedArray([1, 2, 3, 4]), width: 1, height: 1 };
    expect(expectDecoded(encodeOk(image)).data).toEqual([1, 2, 3, 4]);
  });

  it.each(Object.values(PNG_FILTER))('round trips with filter %i forced on every row', (filter) => {
    const image = makeGradient(9, 6);
    const bytes = encodeOk(image, { filter });
    expect(filterBytes(bytes, 9 * 4, 6)).toEqual(Array.from({ length: 6 }, () => filter));
    expect(expectDecoded(bytes).data).toEqual(Array.from(image.data));
  });

  it('writes the same bytes for the same input', () => {
    const image = makeGradient(16, 16);
    expect(Array.from(encodeOk(image))).toEqual(Array.from(encodeOk(makeGradient(16, 16))));
  });

  it('writes the signature and only IHDR, IDAT and IEND', () => {
    const bytes = encodeOk(makeGradient(3, 3));
    expect(Array.from(bytes.subarray(0, 8))).toEqual(Array.from(PNG_SIGNATURE));
    expect(listChunks(bytes).map((chunk) => chunk.type)).toEqual(['IHDR', 'IDAT', 'IEND']);
  });

  it('picks the lowest scoring filter per row and breaks ties towards the lowest type', () => {
    const data = new Uint8ClampedArray(4 * 3 * 4);
    for (let i = 0; i < data.length; i += 4) data.set([200, 100, 50, 255], i);
    const filters: PngFilterType[] = [1, 2, 2];
    expect(filterBytes(encodeOk({ data, width: 4, height: 3 }), 16, 3)).toEqual(filters);
  });

  it('rejects a buffer that does not match the size', () => {
    const result = encodePngRgba({ data: new Uint8ClampedArray(7), width: 2, height: 1 });
    expect(result.ok).toBe(false);
    expect(!result.ok && result.code).toBe(PNG_ERROR_CODE.PNG_INVALID_INPUT);
  });

  it('rejects a zero or fractional size', () => {
    const empty = encodePngRgba({ data: new Uint8ClampedArray(0), width: 0, height: 0 });
    const fraction = encodePngRgba({ data: new Uint8ClampedArray(4), width: 0.5, height: 2 });
    expect(empty.ok).toBe(false);
    expect(fraction.ok).toBe(false);
  });
});

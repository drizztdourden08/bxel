/* @layer tests @kind test */
import { decodeApng, encodePngRgba, FORMAT_ERROR_CODE } from '@bxel/formats';
import type { AnimationDecoded } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { buildApng } from './build-apng';
import type { RawApng, RawApngFrame } from './build-apng';

const RED = [255, 0, 0, 255];
const base = { delayNum: 1, delayDen: 10, dispose: 0, blend: 0 };

const solid = (count: number, rgba: readonly number[]): number[] =>
  Array.from({ length: count }, () => rgba).flat();

const frame = (extra: Partial<RawApngFrame> & Pick<RawApngFrame, 'x' | 'y' | 'width' | 'height'>, rgba: readonly number[]): RawApngFrame => ({
  ...base,
  pixels: solid(extra.width * extra.height, rgba),
  ...extra,
});

const FRAMES: readonly RawApngFrame[] = [
  frame({ x: 0, y: 0, width: 4, height: 4 }, RED),
  frame({ x: 1, y: 1, width: 2, height: 2, blend: 1, dispose: 1, delayNum: 5, delayDen: 0 }, [0, 0, 255, 128]),
  frame({ x: 0, y: 0, width: 1, height: 1, delayNum: 3, delayDen: 1000 }, [0, 255, 0, 255]),
  frame({ x: 3, y: 3, width: 1, height: 1, dispose: 2 }, [255, 255, 255, 255]),
  frame({ x: 2, y: 0, width: 1, height: 1, delayNum: 1, delayDen: 3 }, [255, 255, 0, 255]),
];

const spec = (extra: Partial<RawApng> = {}): RawApng => ({
  width: 4,
  height: 4,
  plays: 2,
  sequenceSkew: 0,
  frames: FRAMES,
  ...extra,
});

const pixel = (decoded: AnimationDecoded, index: number, x: number, y: number): number[] =>
  Array.from(decoded.frames[index]?.data.subarray((y * 4 + x) * 4, (y * 4 + x) * 4 + 4) ?? []);

const decodeOk = (bytes: Uint8Array): AnimationDecoded => {
  const decoded = decodeApng(bytes);
  if (!decoded.ok) throw new Error(decoded.message);
  return decoded;
};

describe('APNG decoder compositing', () => {
  const decoded = decodeOk(buildApng(spec()));

  it('reads loops, frame count and every delay form', () => {
    expect(decoded.loops).toBe(2);
    expect(decoded.frames.map((entry) => entry.delayMs)).toEqual([100, 50, 3, 100, 333]);
  });

  it('blends over the canvas and disposes to the background', () => {
    expect(pixel(decoded, 0, 2, 2)).toEqual(RED);
    expect(pixel(decoded, 1, 1, 1)).toEqual([127, 0, 128, 255]);
    expect(pixel(decoded, 1, 0, 0)).toEqual(RED);
    expect(pixel(decoded, 2, 1, 1)).toEqual([0, 0, 0, 0]);
    expect(pixel(decoded, 2, 0, 0)).toEqual([0, 255, 0, 255]);
  });

  it('restores the previous canvas after a dispose previous frame', () => {
    expect(pixel(decoded, 3, 3, 3)).toEqual([255, 255, 255, 255]);
    expect(pixel(decoded, 4, 3, 3)).toEqual(RED);
    expect(pixel(decoded, 4, 2, 0)).toEqual([255, 255, 0, 255]);
    expect(pixel(decoded, 4, 1, 1)).toEqual([0, 0, 0, 0]);
  });
});

describe('APNG decoder errors', () => {
  it('reports a sequence gap', () => {
    expect(decodeApng(buildApng(spec({ sequenceSkew: 1 })))).toMatchObject({ code: FORMAT_ERROR_CODE.APNG_SEQUENCE });
  });

  it('reports a frame outside the canvas', () => {
    const wide = [frame({ x: 3, y: 0, width: 2, height: 1 }, RED)];
    expect(decodeApng(buildApng(spec({ frames: wide })))).toMatchObject({
      code: FORMAT_ERROR_CODE.APNG_INVALID_DATA,
    });
  });

  it('reports a still PNG as not animated', () => {
    const still = encodePngRgba({ data: new Uint8ClampedArray(16), width: 2, height: 2 });
    if (!still.ok) throw new Error(still.message);
    expect(decodeApng(still.bytes)).toMatchObject({ code: FORMAT_ERROR_CODE.APNG_NOT_ANIMATED });
  });
});

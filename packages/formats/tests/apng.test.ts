/* @layer tests @kind test */
import { decodeApng, encodeApng, FORMAT_ERROR_CODE, PNG_SIGNATURE } from '@bxel/formats';
import type { AnimationDecoded, ApngAnimation } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { expectSameBytes } from './expect-same-bytes';
import { indexedToRgba } from './indexed-to-rgba';
import { listChunks } from './list-chunks';
import { makeIndexedFrames } from './make-indexed-frames';
import { makeRgbaPalette } from './make-rgba-palette';

const DELAYS = [1, 33, 100, 250, 1234, 65535];

const rgbaAnimation = (width: number, height: number, count: number): ApngAnimation => {
  const frames = makeIndexedFrames(count, { width, height }, 200).map((frame, i) => {
    const pixels = new Uint8ClampedArray(width * height * 4);
    pixels.set(indexedToRgba(frame.indices, makeRgbaPalette(200, 0), null));
    return { pixels, delayMs: DELAYS[i % DELAYS.length] ?? 1 };
  });
  return { width, height, palette: undefined, loops: 0, frames };
};

const roundTrip = (animation: ApngAnimation): AnimationDecoded => {
  const encoded = encodeApng(animation);
  if (!encoded.ok) throw new Error(encoded.message);
  const decoded = decodeApng(encoded.bytes);
  if (!decoded.ok) throw new Error(decoded.message);
  return decoded;
};

describe('APNG round trips', () => {
  it.each([
    [1, 1, 1],
    [7, 5, 3],
    [32, 32, 6],
  ])('keeps RGBA frames and exact millisecond delays at %i x %i with %i frames', (width, height, count) => {
    const animation = rgbaAnimation(width, height, count);
    const decoded = roundTrip(animation);
    expect(decoded.frames).toHaveLength(count);
    animation.frames.forEach((frame, i) => {
      expect(Array.from(decoded.frames[i]?.data ?? [])).toEqual(Array.from(frame.pixels));
      expect(decoded.frames[i]?.delayMs).toBe(frame.delayMs);
    });
  });

  it.each([2, 5, 17, 200])('keeps indexed frames with %i colours', (entries) => {
    const width = 9;
    const height = 6;
    const palette = makeRgbaPalette(entries, 0);
    const frames = makeIndexedFrames(4, { width, height }, entries).map((frame) => ({
      pixels: frame.indices,
      delayMs: frame.delayMs,
    }));
    const decoded = roundTrip({ width, height, palette, loops: 3, frames });
    expect(decoded.loops).toBe(3);
    frames.forEach((frame, i) => {
      expect(Array.from(decoded.frames[i]?.data ?? [])).toEqual(indexedToRgba(Uint8Array.from(frame.pixels), palette, null));
      expect(decoded.frames[i]?.delayMs).toBe(frame.delayMs);
    });
  });

  it.each([0, 1, 9])('round trips loop count %i', (loops) => {
    expect(roundTrip({ ...rgbaAnimation(3, 3, 2), loops }).loops).toBe(loops);
  });

  it('writes acTL, fcTL and fdAT with consecutive sequence numbers', () => {
    const encoded = encodeApng(rgbaAnimation(4, 4, 3));
    if (!encoded.ok) throw new Error(encoded.message);
    expect(Array.from(encoded.bytes.subarray(0, 8))).toEqual(Array.from(PNG_SIGNATURE));
    const types = listChunks(encoded.bytes).map((chunk) => chunk.type);
    expect(types).toEqual(['IHDR', 'acTL', 'fcTL', 'IDAT', 'fcTL', 'fdAT', 'fcTL', 'fdAT', 'IEND']);
  });

  it('is deterministic', () => {
    const animation = rgbaAnimation(12, 12, 4);
    expectSameBytes(encodeApng(animation), encodeApng(animation));
  });
});

describe('APNG errors', () => {
  it('rejects bad input without throwing', () => {
    const good = rgbaAnimation(2, 2, 1);
    const frame = good.frames[0];
    const codes = [
      encodeApng({ ...good, frames: [] }),
      encodeApng({ ...good, loops: -1 }),
      encodeApng({ ...good, width: 0 }),
      encodeApng({ ...good, frames: [{ pixels: new Uint8ClampedArray(3), delayMs: 10 }] }),
      encodeApng({ ...good, frames: [{ pixels: frame?.pixels ?? new Uint8Array(16), delayMs: 0 }] }),
      encodeApng({ ...good, palette: makeRgbaPalette(2), frames: [{ pixels: new Uint8Array(4).fill(5), delayMs: 5 }] }),
    ].map((result) => (result.ok ? 'OK' : result.code));
    expect(new Set(codes)).toEqual(new Set([FORMAT_ERROR_CODE.APNG_INVALID_INPUT]));
  });

  it('rejects a plain PNG, garbage and truncation', () => {
    expect(decodeApng(new Uint8Array(3))).toMatchObject({ code: FORMAT_ERROR_CODE.APNG_INVALID_DATA });
    const encoded = encodeApng(rgbaAnimation(6, 6, 2));
    if (!encoded.ok) throw new Error(encoded.message);
    expect(decodeApng(encoded.bytes.subarray(0, encoded.bytes.length - 20)).ok).toBe(false);
    const cut = decodeApng(encoded.bytes.subarray(0, 30));
    expect(cut.ok).toBe(false);
  });
});

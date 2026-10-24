/* @layer tests @kind test */
import { decodeGif, encodeGif, FORMAT_ERROR_CODE, gifDelayCs } from '@bxel/formats';
import type { AnimationDecoded, GifAnimation } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { expectSameBytes } from './expect-same-bytes';
import { indexedToRgba } from './indexed-to-rgba';
import { makeIndexedFrames } from './make-indexed-frames';
import { makeRgbaPalette } from './make-rgba-palette';

type Spec = { readonly entries: number; readonly width: number; readonly height: number };

const build = (spec: Spec, frames = 3, extra: Partial<GifAnimation> = {}): GifAnimation => ({
  width: spec.width,
  height: spec.height,
  palette: makeRgbaPalette(spec.entries),
  transparentIndex: null,
  loops: 0,
  frames: makeIndexedFrames(frames, spec, spec.entries),
  ...extra,
});

const roundTrip = (animation: GifAnimation): AnimationDecoded => {
  const encoded = encodeGif(animation);
  if (!encoded.ok) throw new Error(encoded.message);
  const decoded = decodeGif(encoded.bytes);
  if (!decoded.ok) throw new Error(decoded.message);
  return decoded;
};

const SMALL: Spec = { entries: 4, width: 3, height: 3 };

describe('GIF round trips', () => {
  it.each([
    [2, 1, 1],
    [3, 5, 4],
    [4, 16, 16],
    [17, 33, 21],
    [200, 64, 64],
    [256, 150, 150],
  ])('keeps frames and delays for %i colours at %i x %i', (entries, width, height) => {
    const animation = build({ entries, width, height });
    const decoded = roundTrip(animation);
    expect(decoded.width).toBe(width);
    expect(decoded.height).toBe(height);
    expect(decoded.frames).toHaveLength(3);
    animation.frames.forEach((frame, i) => {
      const got = decoded.frames[i];
      expect(Array.from(got?.data ?? [])).toEqual(indexedToRgba(frame.indices, animation.palette, null));
      expect(got?.delayMs).toBe(gifDelayCs(frame.delayMs) * 10);
    });
  });

  it('honours the transparent index and replaces the previous frame', () => {
    const animation = build({ entries: 8, width: 12, height: 12 }, 3, { transparentIndex: 0 });
    const decoded = roundTrip(animation);
    animation.frames.forEach((frame, i) => {
      const expected = indexedToRgba(frame.indices, animation.palette, 0);
      expect(Array.from(decoded.frames[i]?.data ?? [])).toEqual(expected);
    });
  });

  it('is deterministic', () => {
    const animation = build({ entries: 64, width: 40, height: 40 });
    expectSameBytes(encodeGif(animation), encodeGif(animation));
  });
});

describe('GIF timing and looping', () => {
  it('rounds delays to centiseconds half up with a one centisecond floor', () => {
    const cases: readonly [number, number][] = [
      [1, 1],
      [4, 1],
      [5, 1],
      [14, 1],
      [15, 2],
      [100, 10],
      [104, 10],
      [105, 11],
      [655350, 65535],
    ];
    for (const [ms, cs] of cases) expect(gifDelayCs(ms)).toBe(cs);
  });

  it('stores the rounded delay in the file', () => {
    const animation = build(SMALL, 1);
    const frame = { indices: new Uint8Array(9), delayMs: 133 };
    expect(roundTrip({ ...animation, frames: [frame] }).frames[0]?.delayMs).toBe(130);
  });

  it.each([0, 1, 2, 7])('round trips loop count %i', (loops) => {
    expect(roundTrip(build(SMALL, 2, { loops })).loops).toBe(loops);
  });

  it('writes NETSCAPE2.0 only when the animation repeats', () => {
    const text = (loops: number): string => {
      const result = encodeGif(build(SMALL, 2, { loops }));
      return result.ok ? String.fromCharCode(...result.bytes) : '';
    };
    expect(text(0)).toContain('NETSCAPE2.0');
    expect(text(5)).toContain('NETSCAPE2.0');
    expect(text(1)).not.toContain('NETSCAPE2.0');
  });
});

describe('GIF errors', () => {
  it('rejects bad input without throwing', () => {
    const good = build({ entries: 4, width: 2, height: 2 }, 1);
    const frame = (indices: Uint8Array, delayMs: number): GifAnimation['frames'] => [{ indices, delayMs }];
    const codes = [
      encodeGif({ ...good, width: 0 }),
      encodeGif({ ...good, frames: [] }),
      encodeGif({ ...good, palette: new Uint8Array(0) }),
      encodeGif({ ...good, transparentIndex: 9 }),
      encodeGif({ ...good, loops: -1 }),
      encodeGif({ ...good, frames: frame(new Uint8Array(3), 10) }),
      encodeGif({ ...good, frames: frame(new Uint8Array(4).fill(9), 10) }),
      encodeGif({ ...good, frames: frame(new Uint8Array(4), 0) }),
    ].map((result) => (result.ok ? 'OK' : result.code));
    expect(new Set(codes)).toEqual(new Set([FORMAT_ERROR_CODE.GIF_INVALID_INPUT]));
  });

  it('rejects garbage and truncated files', () => {
    expect(decodeGif(new Uint8Array(4))).toMatchObject({ code: FORMAT_ERROR_CODE.GIF_TRUNCATED });
    expect(decodeGif(new Uint8Array(40).fill(7))).toMatchObject({
      code: FORMAT_ERROR_CODE.GIF_INVALID_DATA,
    });
    const encoded = encodeGif(build({ entries: 16, width: 20, height: 20 }));
    if (!encoded.ok) throw new Error(encoded.message);
    for (const cut of [20, 40, encoded.bytes.length - 1]) {
      expect(decodeGif(encoded.bytes.subarray(0, cut)).ok).toBe(false);
    }
  });
});

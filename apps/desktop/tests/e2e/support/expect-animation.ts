/* @layer renderer-app @kind logic */
import type { AnimationDecodeResult } from '@bxel/formats';
import { expect } from 'vitest';

type Expected = { readonly width: number; readonly height: number; readonly durations: readonly number[] };

const visible = (data: ArrayLike<number>, count: number) =>
  Array.from({ length: count }, (_unused, at) => ((data[at * 4 + 3] ?? 0) === 0 ? [0] : [data[at * 4], data[at * 4 + 1], data[at * 4 + 2]]));

const expectAnimation = (result: AnimationDecodeResult, expected: Expected, rgba: (frameAt: number) => Uint8Array): void => {
  if (!result.ok) throw new Error(result.message);
  expect([result.width, result.height]).toEqual([expected.width, expected.height]);
  expect(result.frames.map((frame) => frame.delayMs)).toEqual([...expected.durations]);
  expected.durations.forEach((_duration, frameAt) => {
    const got = result.frames[frameAt]?.data ?? new Uint8ClampedArray();
    expect(visible(got, expected.width * expected.height), `frame ${frameAt} pixels`).toEqual(visible(rgba(frameAt), expected.width * expected.height));
  });
};

export { expectAnimation };

/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import type { AnimationDecodeResult } from '@bxel/formats';
import { expect } from 'vitest';

const visible = (data: ArrayLike<number>, count: number) =>
  Array.from({ length: count }, (_unused, at) => ((data[at * 4 + 3] ?? 0) === 0 ? [0] : [data[at * 4], data[at * 4 + 1], data[at * 4 + 2]]));

const expectAnimation = (result: AnimationDecodeResult, sprite: Sprite, durations: readonly number[], rgba: (frameAt: number) => Uint8Array): void => {
  if (!result.ok) throw new Error(result.message);
  expect([result.width, result.height]).toEqual([sprite.width, sprite.height]);
  expect(result.frames.map((frame) => frame.delayMs)).toEqual([...durations]);
  sprite.frames.forEach((_frame, frameAt) => {
    const got = result.frames[frameAt]?.data ?? new Uint8ClampedArray();
    expect(visible(got, sprite.width * sprite.height), `frame ${frameAt} pixels`).toEqual(visible(rgba(frameAt), sprite.width * sprite.height));
  });
};

export { expectAnimation };

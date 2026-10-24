/* @layer renderer-app @kind test */
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { frameToRgba, requireBank } from '@bxel/document';
import type { Sprite } from '@bxel/document';
import { decodeApng, decodeGif } from '@bxel/formats';
import type { AnimationDecodeResult } from '@bxel/formats';
import { ANIMATION } from './support/animation.constants';
import { buildAnimationFile } from './support/build-animation-file';
import type { Session } from './support/e2e.type';
import { exportAnimation } from './support/export-animation';
import { openFile } from './support/open-file';
import { openSession } from './support/open-session';
import { readSaved } from './support/read-saved';
import { spriteOf } from './support/sprite-of';

const SIDE = ANIMATION.side;

const checkAnimation = (result: AnimationDecodeResult, sprite: Sprite, rgba: (frameAt: number) => Uint8Array) => {
  if (!result.ok) throw new Error(result.message);
  expect([result.width, result.height]).toEqual([SIDE, SIDE]);
  expect(result.frames.map((frame) => frame.delayMs)).toEqual([...ANIMATION.durations]);
  sprite.frames.forEach((_, frameAt) => {
    const expected = rgba(frameAt);
    const got = result.frames[frameAt]?.data ?? new Uint8ClampedArray();
    const visible = (data: ArrayLike<number>) => Array.from({ length: SIDE * SIDE }, (__, at) => ((data[at * 4 + 3] ?? 0) === 0 ? [0] : [data[at * 4], data[at * 4 + 1], data[at * 4 + 2]]));
    expect(visible(got), `frame ${frameAt} pixels`).toEqual(visible(expected));
  });
};

describe('check 6: an animation exports its frames and durations', () => {
  const state: { session?: Session; sprite?: Sprite; rgba?: (frameAt: number) => Uint8Array } = {};
  const live = () => {
    if (!state.session || !state.sprite || !state.rgba) throw new Error('no session');
    return { session: state.session, sprite: state.sprite, rgba: state.rgba };
  };

  beforeAll(async () => {
    const session = await openSession();
    state.session = session;
    const path = await buildAnimationFile(session.dir);
    const artwork = readSaved(path);
    const sprite = spriteOf(artwork, ANIMATION.spriteName);
    const bank = requireBank(artwork, sprite.bankId);
    state.sprite = sprite;
    state.rgba = (frameAt) => frameToRgba(sprite, bank, sprite.frames[frameAt]?.id ?? ('' as never));
    await openFile(session, path);
  });

  afterAll(async () => {
    await state.session?.close();
  });

  test('the fixture has three distinct frames with a tag', () => {
    const { sprite, rgba } = live();
    expect(sprite.frames.map((frame) => frame.durationMs)).toEqual([...ANIMATION.durations]);
    expect(sprite.tags.map((tag) => tag.name)).toEqual([ANIMATION.tagName]);
    expect(new Set([0, 1, 2].map((at) => rgba(at).join(','))).size).toBe(3);
  });

  test('GIF export keeps the frame order, timing and pixels', async () => {
    const { session, sprite, rgba } = live();
    checkAnimation(decodeGif(await exportAnimation(session, 'GIF')), sprite, rgba);
  });

  test('APNG export keeps the frame order, timing and pixels', async () => {
    const { session, sprite, rgba } = live();
    checkAnimation(decodeApng(await exportAnimation(session, 'APNG')), sprite, rgba);
  });
});

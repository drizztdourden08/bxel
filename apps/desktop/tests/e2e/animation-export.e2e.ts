/* @layer renderer-app @kind test */
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { frameToRgba, requireBank } from '@bxel/document';
import type { Sprite } from '@bxel/document';
import { decodeApng, decodeGif } from '@bxel/formats';
import { ANIMATION } from './support/animation.constants';
import { buildAnimationFile } from './support/build-animation-file';
import type { Session } from './support/e2e.type';
import { expectAnimation } from './support/expect-animation';
import { exportAnimation } from './support/export-animation';
import { openFile } from './support/open-file';
import { openSession } from './support/open-session';
import { readSaved } from './support/read-saved';
import { spriteOf } from './support/sprite-of';

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
    expectAnimation(decodeGif(await exportAnimation(session, 'GIF')), sprite, ANIMATION.durations, rgba);
  });

  test('APNG export keeps the frame order, timing and pixels', async () => {
    const { session, sprite, rgba } = live();
    expectAnimation(decodeApng(await exportAnimation(session, 'APNG')), sprite, ANIMATION.durations, rgba);
  });
});

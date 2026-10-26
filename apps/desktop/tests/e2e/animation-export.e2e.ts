/* @layer renderer-app @kind test */
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { composeAnimationFrame, requireBank, paletteRgba, TRANSPARENT_INDEX } from '@bxel/document';
import type { Animation, Artwork } from '@bxel/document';
import { decodeApng, decodeGif } from '@bxel/formats';
import { openAssetTab } from './support/open-asset-tab';
import { ANIMATION } from './support/animation.constants';
import { buildAnimationAsset } from './support/build-animation-asset';
import type { Session } from './support/e2e.type';
import { expectAnimation } from './support/expect-animation';
import { exportAnimation } from './support/export-animation';
import { openFile } from './support/open-file';
import { openSession } from './support/open-session';
import { readSaved } from './support/read-saved';

const rgbaOf = (artwork: Artwork, animation: Animation) => (frameAt: number): Uint8Array => {
  const frame = animation.frames[frameAt];
  const table = paletteRgba(requireBank(artwork, animation.bankId));
  const indices = composeAnimationFrame(artwork, animation, frame?.id ?? ('' as never));
  const out = new Uint8Array(indices.length * 4);
  indices.forEach((index, at) => {
    if (index !== TRANSPARENT_INDEX) out.set(table.subarray(index * 4, index * 4 + 4), at * 4);
  });
  return out;
};

describe('check 6: an animation exports its frames and durations', () => {
  const state: { session?: Session; animation?: Animation; rgba?: (frameAt: number) => Uint8Array } = {};
  const live = () => {
    if (!state.session || !state.animation || !state.rgba) throw new Error('no session');
    return { session: state.session, animation: state.animation, rgba: state.rgba };
  };

  beforeAll(async () => {
    const session = await openSession();
    state.session = session;
    const path = await buildAnimationAsset(session.dir);
    const artwork = readSaved(path);
    const animation = artwork.animations[0];
    if (!animation) throw new Error('the fixture holds no animation');
    state.animation = animation;
    state.rgba = rgbaOf(artwork, animation);
    await openFile(session, path);
    await openAssetTab(session, new RegExp(ANIMATION.spriteName)).waitFor();
  });

  afterAll(async () => {
    await state.session?.close();
  });

  test('the fixture has three distinct frames with a tag', () => {
    const { animation, rgba } = live();
    expect(animation.frames.map((frame) => frame.durationMs)).toEqual([...ANIMATION.durations]);
    expect(animation.tags.map((tag) => (tag.kind === 'span' ? tag.name : ''))).toEqual([ANIMATION.tagName]);
    expect(new Set([0, 1, 2].map((at) => rgba(at).join(','))).size).toBe(3);
  });

  test('GIF export keeps the frame order, timing and pixels', async () => {
    const { session, animation, rgba } = live();
    expectAnimation(decodeGif(await exportAnimation(session, 'GIF')), { width: animation.width, height: animation.height, durations: ANIMATION.durations }, rgba);
  });

  test('APNG export keeps the frame order, timing and pixels', async () => {
    const { session, animation, rgba } = live();
    expectAnimation(decodeApng(await exportAnimation(session, 'APNG')), { width: animation.width, height: animation.height, durations: ANIMATION.durations }, rgba);
  });
});

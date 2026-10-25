/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { frameToRgba, requireBank } from '@bxel/document';
import type { Sprite } from '@bxel/document';
import { decodeApng, decodeGif } from '@bxel/formats';
import { describe, expect, test } from 'vitest';
import { buildAnimationInUi } from './support/build-animation-in-ui';
import { canvasMapper } from './support/canvas-mapper';
import type { Cell, Session } from './support/e2e.type';
import { expectAnimation } from './support/expect-animation';
import { exportAnimation } from './support/export-animation';
import { openFile } from './support/open-file';
import { openSession } from './support/open-session';
import { readSaved } from './support/read-saved';
import { sampleCanvas } from './support/sample-canvas';
import { saveFile } from './support/save-file';
import { spriteOf } from './support/sprite-of';
import { UI_ANIMATION } from './support/ui-animation.constants';
import { useRig } from './support/use-rig';

const SIZE = { width: UI_ANIMATION.side, height: UI_ANIMATION.side };

const FIRST_MARK: Cell = { x: 1, y: 1 };

const held: { sprite?: Sprite; rgba?: (frameAt: number) => Uint8Array } = {};

const built = () => {
  const { sprite, rgba } = held;
  if (!sprite || !rgba) throw new Error('the animation was not built yet');
  return { sprite, rgba };
};

const buildsAndSaves = async (session: Session): Promise<void> => {
  await buildAnimationInUi(session);
  const path = join(session.dir, UI_ANIMATION.file);
  await saveFile(session, path);
  const artwork = readSaved(path);
  const sprite = spriteOf(artwork, 'run');
  const bank = requireBank(artwork, sprite.bankId);
  const rgba = (frameAt: number) => frameToRgba(sprite, bank, sprite.frames[frameAt]?.id ?? ('' as never));
  Object.assign(held, { sprite, rgba });
  expect(sprite.frames.map((frame) => frame.durationMs)).toEqual([...UI_ANIMATION.durations]);
  expect(sprite.tags.map((tag) => [tag.name, tag.from, tag.to])).toEqual([[UI_ANIMATION.tag, sprite.frames[0]?.id, sprite.frames[2]?.id]]);
  expect(new Set([0, 1, 2].map((at) => rgba(at).join(','))).size).toBe(3);
};

const showsOnionSkin = async (session: Session): Promise<void> => {
  const map = await canvasMapper(session, SIZE);
  const toolbar = session.page.getByRole('toolbar', { name: 'Canvas' });
  await session.page.getByRole('region', { name: 'Timeline' }).getByRole('button', { name: /^Frame 2,/ }).click();
  const before = await sampleCanvas(session, [map(FIRST_MARK)]);
  await toolbar.getByRole('button', { name: 'Onion skin' }).click();
  await toolbar.getByRole('button', { name: 'Onion skin', pressed: true }).waitFor();
  expect(await sampleCanvas(session, [map(FIRST_MARK)]), 'the previous frame shows through').not.toEqual(before);
  await toolbar.getByRole('button', { name: 'Onion skin' }).click();
  expect(await sampleCanvas(session, [map(FIRST_MARK)])).toEqual(before);
};

const exportsBoth = async (session: Session): Promise<void> => {
  const { sprite, rgba } = built();
  expectAnimation(decodeGif(await exportAnimation(session, 'GIF')), sprite, UI_ANIMATION.durations, rgba);
  expectAnimation(decodeApng(await exportAnimation(session, 'APNG')), sprite, UI_ANIMATION.durations, rgba);
};

const reopensAndSavesAgain = async (session: Session): Promise<void> => {
  const { sprite, rgba } = built();
  const second = await openSession();
  try {
    await openFile(second, join(session.dir, UI_ANIMATION.file));
    const again = join(second.dir, 'again.bxsprite');
    await saveFile(second, again);
    const artwork = readSaved(again);
    const reopened = spriteOf(artwork, 'again');
    const bank = requireBank(artwork, reopened.bankId);
    expect(reopened.frames.map((frame) => frame.durationMs)).toEqual(sprite.frames.map((frame) => frame.durationMs));
    expect(reopened.tags.map((tag) => tag.name)).toEqual([UI_ANIMATION.tag]);
    sprite.frames.forEach((_frame, at) => expect(frameToRgba(reopened, bank, reopened.frames[at]?.id ?? ('' as never)), `frame ${at}`).toEqual(rgba(at)));
  } finally {
    await second.close();
  }
};

describe('check 6: a tagged animation built in the editor', () => {
  const rig = useRig(async () => ({ session: await openSession() }));
  test('three frames with distinct durations, pixels and one tag are saved', () => buildsAndSaves(rig().session));
  test('onion skin shows the previous frame and turns off again', () => showsOnionSkin(rig().session));
  test('GIF and APNG exports keep the order, timing and pixels', () => exportsBoth(rig().session));
  test('the saved file reopens and saves again with the same frames, timing, tag and pixels', () => reopensAndSavesAgain(rig().session));
});

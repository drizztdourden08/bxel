/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { flattenFrame } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { frameButton, timelineOf } from './support/animation-ui';
import { buildAnimationInUi } from './support/build-animation-in-ui';
import { canvasMapper } from './support/canvas-mapper';
import type { Cell, Session } from './support/e2e.type';
import { openFile } from './support/open-file';
import { openSession } from './support/open-session';
import { readSaved } from './support/read-saved';
import { sampleCanvas } from './support/sample-canvas';
import { saveFile } from './support/save-file';
import { UI_ANIMATION } from './support/ui-animation.constants';
import { useRig } from './support/use-rig';

const SIZE = { width: UI_ANIMATION.side, height: UI_ANIMATION.side };

const FIRST_MARK: Cell = { x: 1, y: 1 };

const framesOf = (artwork: Artwork) => {
  const animation = artwork.animations[0];
  if (!animation) throw new Error('the file holds no animation');
  const pictures = animation.frames.map((frame) => {
    const sprite = artwork.sprites.find((each) => each.id === frame.spriteId);
    if (!sprite) throw new Error('a frame has no sprite');
    return flattenFrame(sprite, sprite.frames[0]?.id as never).join(',');
  });
  return { animation, pictures };
};

const expectBuilt = (artwork: Artwork): void => {
  const { animation, pictures } = framesOf(artwork);
  expect(animation.frames.map((frame) => frame.durationMs)).toEqual([...UI_ANIMATION.durations]);
  expect(animation.tags.map((tag) => (tag.kind === 'span' ? [tag.name, tag.from, tag.to] : []))).toEqual([[UI_ANIMATION.tag, animation.frames[0]?.id, animation.frames[2]?.id]]);
  expect(new Set(pictures).size).toBe(3);
};

const held: { pictures?: string[] } = {};

const buildsAndSaves = async (session: Session): Promise<void> => {
  await buildAnimationInUi(session);
  const path = join(session.dir, UI_ANIMATION.file);
  await saveFile(session, path);
  const artwork = readSaved(path);
  expectBuilt(artwork);
  held.pictures = framesOf(artwork).pictures;
};

const showsOnionSkin = async (session: Session): Promise<void> => {
  const map = await canvasMapper(session, SIZE);
  const toolbar = session.page.getByRole('toolbar', { name: 'Canvas' });
  await frameButton(session, 2).click();
  const before = await sampleCanvas(session, [map(FIRST_MARK)]);
  await toolbar.getByRole('button', { name: 'Onion skin' }).click();
  await toolbar.getByRole('button', { name: 'Onion skin', pressed: true }).waitFor();
  await expect.poll(() => sampleCanvas(session, [map(FIRST_MARK)]), { message: 'the previous frame shows through' }).not.toEqual(before);
  await toolbar.getByRole('button', { name: 'Onion skin', pressed: true }).click();
  await expect.poll(() => sampleCanvas(session, [map(FIRST_MARK)])).toEqual(before);
};

const listsTheTag = async (session: Session): Promise<void> => {
  await timelineOf(session).getByRole('button', { name: new RegExp(`^${UI_ANIMATION.tag}, Forward`) }).first().waitFor();
};

const reopensAndSavesAgain = async (session: Session): Promise<void> => {
  const second = await openSession();
  try {
    await openFile(second, join(session.dir, UI_ANIMATION.file));
    const again = join(second.dir, 'again.bxanim');
    await saveFile(second, again);
    const artwork = readSaved(again);
    expectBuilt(artwork);
    expect(framesOf(artwork).pictures).toEqual(held.pictures);
  } finally {
    await second.close();
  }
};

describe('check 6: a tagged animation built in the editor', () => {
  const rig = useRig(async () => ({ session: await openSession() }));
  test('three frames with distinct durations, pixels and one tag are saved', () => buildsAndSaves(rig().session));
  test('the tag shows in the lane over its frames', () => listsTheTag(rig().session));
  test('onion skin shows the previous frame and turns off again', () => showsOnionSkin(rig().session));
  test('the saved file reopens and saves again with the same frames, timing, tag and pixels', () => reopensAndSavesAgain(rig().session));
});

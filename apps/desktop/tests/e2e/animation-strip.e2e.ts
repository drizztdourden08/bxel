/* @layer renderer-app @kind test */
import { composeAnimationFrame } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { frameButton, openAnimationTab, timelineOf } from './support/animation-ui';
import { POLL_MS, SHORTCUT } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { openProjectAtInUi } from './support/open-project-at-in-ui';
import { openSession } from './support/open-session';
import { openStripRig } from './support/open-strip-rig';
import { assetDigests, assetFiles, fileNamed } from './support/project-files';
import { readSaved } from './support/read-saved';
import { STRIP } from './support/strip-project.constants';
import { useRig } from './support/use-rig';

const held: { before?: string[]; fileCount?: number } = {};

const picturesOf = (artwork: Artwork): string[] => {
  const animation = artwork.animations.find((each) => each.name === STRIP.animation);
  if (!animation) throw new Error('the project holds no animation');
  return animation.frames.map((frame) => composeAnimationFrame(artwork, animation, frame.id).join(','));
};

const savedWalk = async (root: string): Promise<Artwork> => readSaved(await fileNamed(root, `${STRIP.animation}.bxanim`));

const addsTheStrip = async (session: Session, root: string): Promise<void> => {
  await openAnimationTab(session, STRIP.animation);
  const timeline = timelineOf(session);
  await timeline.getByRole('button', { name: 'Add frames from' }).click();
  await session.page.getByRole('menuitem', { name: 'A strip...' }).click();
  const dialog = session.page.getByRole('dialog', { name: 'Add frames from a strip' });
  await dialog.getByText(`${STRIP.cells} frames of ${STRIP.side} by ${STRIP.side} pixels will be added.`).waitFor();
  await dialog.getByRole('button', { name: 'Add frames' }).click();
  await dialog.waitFor({ state: 'detached' });
  await frameButton(session, STRIP.cells + 1).waitFor();
  expect(await frameButton(session, 2).getAttribute('aria-label')).toBe('Frame 2, 100 milliseconds, shared, clip');
  await session.page.keyboard.press(SHORTCUT.saveAll);
  await expect.poll(async () => (await savedWalk(root)).animations[0]?.frames.length, { timeout: POLL_MS }).toBe(STRIP.cells + 1);
  const artwork = await savedWalk(root);
  const frames = artwork.animations[0]?.frames ?? [];
  expect(frames.slice(1).every((frame) => frame.clip !== null)).toBe(true);
  expect(new Set(picturesOf(artwork).slice(1)).size).toBe(STRIP.cells);
  held.before = picturesOf(artwork);
  held.fileCount = (await assetFiles(root)).length;
};

const splitsToSprites = async (session: Session, root: string): Promise<void> => {
  const timeline = timelineOf(session);
  await timeline.getByRole('button', { name: 'Transform animation' }).click();
  await session.page.getByRole('menuitem', { name: 'Split to sprites' }).click();
  await session.page.getByText(`${STRIP.cells} sprites were made from the frames.`).waitFor();
  expect(await frameButton(session, 2).getAttribute('aria-label')).toBe('Frame 2, 100 milliseconds, shared');
  await session.page.keyboard.press(SHORTCUT.saveAll);
  await expect.poll(async () => (await assetFiles(root)).length, { timeout: POLL_MS }).toBe((held.fileCount ?? 0) + STRIP.cells);
  const artwork = await savedWalk(root);
  const frames = artwork.animations[0]?.frames ?? [];
  expect(frames.slice(1).every((frame) => frame.clip === null)).toBe(true);
  expect(new Set(frames.slice(1).map((frame) => frame.spriteId)).size).toBe(STRIP.cells);
  expect(picturesOf(artwork)).toEqual(held.before);
};

const reopensIdentical = async (root: string): Promise<void> => {
  const before = await assetDigests(root);
  const second = await openSession();
  try {
    await openProjectAtInUi(second, root, STRIP.project);
    await openAnimationTab(second, STRIP.animation);
    await frameButton(second, STRIP.cells + 1).waitFor();
    await second.page.keyboard.press(SHORTCUT.saveAll);
    expect(picturesOf(await savedWalk(root))).toEqual(held.before);
    expect(await assetDigests(root)).toEqual(before);
  } finally {
    await second.close();
  }
};

describe('a strip added by reference and split to sprites', () => {
  const rig = useRig(openStripRig);
  test('the strip arrives as four frames that show the cells of one sprite', () => addsTheStrip(rig().session, rig().root));
  test('Split to sprites gives each cell a sprite of its own and the frames look the same', () => splitsToSprites(rig().session, rig().root));
  test('the project reopens and saves again with the same files and frames', () => reopensIdentical(rig().root));
});

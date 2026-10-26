/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { flattenFrame } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { fillNumber, frameButton, timelineOf } from './support/animation-ui';
import { canvasMapper } from './support/canvas-mapper';
import { createAsset } from './support/create-asset';
import { createSprite } from './support/create-sprite';
import { drawStroke } from './support/draw-stroke';
import { POLL_MS } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { openAssetTab } from './support/open-asset-tab';
import { openSession } from './support/open-session';
import { pickSwatch } from './support/pick-swatch';
import { readSaved } from './support/read-saved';
import { saveFile } from './support/save-file';
import { useRig } from './support/use-rig';

const SIZE = { width: 16, height: 16 };

const FILE = 'walk.bxanim';

const STROKES = [
  { swatch: 2, cells: [{ x: 1, y: 1 }, { x: 4, y: 1 }] },
  { swatch: 3, cells: [{ x: 2, y: 6 }, { x: 2, y: 9 }] },
] as const;

const draws = async (session: Session): Promise<void> => {
  const [first, second] = STROKES;
  await createSprite(session);
  await createAsset(session, 'Animation');
  await openAssetTab(session, /animation/).waitFor();
  await frameButton(session, 1).waitFor();
  expect(await frameButton(session, 1).getAttribute('aria-label')).toBe('Frame 1, 100 milliseconds, owned');
  const map = await canvasMapper(session, SIZE);
  await pickSwatch(session, first.swatch);
  await drawStroke(session, map, first.cells);
  await timelineOf(session).getByRole('button', { name: 'Add frame', exact: true }).click();
  await frameButton(session, 2).waitFor();
  await expect.poll(() => frameButton(session, 2).getAttribute('aria-current'), { timeout: POLL_MS }).toBe('true');
  await fillNumber(timelineOf(session).getByRole('spinbutton', { name: /^Frame duration/ }), 240);
  await pickSwatch(session, second.swatch);
  await drawStroke(session, map, second.cells);
};

const saves = async (session: Session): Promise<void> => {
  const path = join(session.dir, FILE);
  await saveFile(session, path);
  const artwork = readSaved(path);
  const animation = artwork.animations[0];
  expect(animation?.frames.map((frame) => frame.durationMs)).toEqual([100, 240]);
  const [first, second] = (animation?.frames ?? []).map((frame) => artwork.sprites.find((sprite) => sprite.id === frame.spriteId));
  expect([first?.role, second?.role]).toEqual(['frame', 'frame']);
  if (!first || !second) throw new Error('the frames have no sprites');
  const marks = (sprite: typeof first, cell: { x: number; y: number }): number => flattenFrame(sprite, sprite.frames[0]?.id as never)[cell.y * SIZE.width + cell.x] ?? 0;
  expect(marks(first, STROKES[0].cells[0])).toBe(STROKES[0].swatch);
  expect(marks(second, STROKES[1].cells[0])).toBe(STROKES[1].swatch);
  expect(marks(first, STROKES[1].cells[0])).toBe(0);
};

const offersAnAnimationOnASprite = async (session: Session): Promise<void> => {
  const tabs = session.page.getByRole('tablist', { name: 'Open assets' }).getByRole('tab');
  const before = await tabs.count();
  await openAssetTab(session, /^sprite$/i).last().click();
  await timelineOf(session).getByText('Sprites are still images. An animation holds the frames.').waitFor();
  await timelineOf(session).getByRole('button', { name: 'Open an animation' }).click();
  await session.page.getByRole('menuitem', { name: 'walk', exact: true }).click();
  await timelineOf(session).getByRole('list', { name: 'Frames' }).waitFor();
  await openAssetTab(session, /^sprite$/i).last().click();
  await timelineOf(session).getByRole('button', { name: 'Make an animation from this sprite' }).click();
  await expect.poll(() => tabs.count(), { timeout: POLL_MS }).toBe(before + 1);
  expect(await frameButton(session, 1).getAttribute('aria-label')).toBe('Frame 1, 100 milliseconds, shared');
};

describe('creating and drawing an animation', () => {
  const rig = useRig(async () => ({ session: await openSession() }));
  test('draws two frames of different times on their own sprites', () => draws(rig().session));
  test('saves one .bxanim with the frames, their times and their pixels', () => saves(rig().session));
  test('a sprite tab offers to make an animation or to open one', () => offersAnAnimationOnASprite(rig().session));
});

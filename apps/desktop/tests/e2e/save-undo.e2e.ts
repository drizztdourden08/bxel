/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { buildSampleArtwork } from './support/build-sample-artwork';
import { canvasMapper } from './support/canvas-mapper';
import { createSprite } from './support/create-sprite';
import { drawStroke } from './support/draw-stroke';
import { SHORTCUT } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { inFreshPlace } from './support/in-place';
import { MARKS_SIDE } from './support/marks.constants';
import { openAssetTab } from './support/open-asset-tab';
import { openProjectAtInUi } from './support/open-project-at-in-ui';
import { openSession } from './support/open-session';
import { readDisplayed } from './support/read-displayed';
import { readSwatches } from './support/read-swatches';
import { SAMPLE } from './support/sample.constants';
import { saveFile } from './support/save-file';
import { useRig } from './support/use-rig';
import { waitSaved } from './support/wait-saved';
import { waitUnsaved } from './support/wait-unsaved';
import { writeSampleProject } from './support/write-sample-project';

const SIZE = { width: MARKS_SIDE, height: MARKS_SIDE };

const FIRST = [{ x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 }];

const SECOND = [{ x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }];

const filled = (grid: Uint8Array): number => grid.filter((index) => index !== 0).length;

const shownOf = async (session: Session, map: Awaited<ReturnType<typeof canvasMapper>>): Promise<number> =>
  filled(await readDisplayed(session, map, SIZE, await readSwatches(session)));

const keepsUndoAcrossSaves = async (session: Session): Promise<void> => {
  const { keyboard } = session.page;
  await createSprite(session);
  const map = await canvasMapper(session, SIZE);
  await drawStroke(session, map, FIRST);
  await saveFile(session, join(session.dir, 'keep.bxsprite'));
  await drawStroke(session, map, SECOND);
  await waitUnsaved(session);
  await keyboard.press(SHORTCUT.save);
  await waitSaved(session);
  expect(await shownOf(session, map)).toBe(FIRST.length + SECOND.length);
  await keyboard.press(SHORTCUT.undo);
  await waitUnsaved(session);
  expect(await shownOf(session, map)).toBe(FIRST.length);
  await keyboard.press(SHORTCUT.redo);
  await waitSaved(session);
  expect(await shownOf(session, map)).toBe(FIRST.length + SECOND.length);
  await keyboard.press(SHORTCUT.undo);
  await keyboard.press(SHORTCUT.undo);
  await keyboard.press(SHORTCUT.undo);
  await waitUnsaved(session);
  expect(await shownOf(session, map)).toBe(0);
  await keyboard.press(SHORTCUT.redo);
  await keyboard.press(SHORTCUT.redo);
  await keyboard.press(SHORTCUT.redo);
  await waitSaved(session);
  expect(await shownOf(session, map)).toBe(FIRST.length + SECOND.length);
};

const keepsUndoAcrossProjectSave = async (session: Session, place: string): Promise<void> => {
  const { keyboard } = session.page;
  const root = join(place, 'Sample');
  await writeSampleProject(root, buildSampleArtwork(), SAMPLE.name);
  await openProjectAtInUi(session, root, SAMPLE.name);
  await openAssetTab(session, new RegExp(SAMPLE.sprites[0])).waitFor();
  const map = await canvasMapper(session, SAMPLE.size);
  const before = await shownOf(session, map);
  await drawStroke(session, map, SECOND);
  await waitUnsaved(session);
  await keyboard.press(SHORTCUT.saveAll);
  await waitSaved(session);
  expect(await shownOf(session, map)).toBe(before + SECOND.length);
  await keyboard.press(SHORTCUT.undo);
  await waitUnsaved(session);
  expect(await shownOf(session, map)).toBe(before);
  await keyboard.press(SHORTCUT.redo);
  await waitSaved(session);
  expect(await shownOf(session, map)).toBe(before + SECOND.length);
};

describe('undo survives a save and the file mark follows the saved point', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('a saved sprite undoes past the save point (unsaved) and redoes back to it (saved)', () => keepsUndoAcrossSaves(rig().session));

  test('a project save keeps the undo history of its assets', () => inFreshPlace((place) => keepsUndoAcrossProjectSave(rig().session, place)));
});

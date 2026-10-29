/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { frameButton, framesOf, openFacing, openMore } from './support/animation-ui';
import type { Session } from './support/e2e.type';
import { exportAnimationFiles } from './support/export-animation';
import { openCompassRig } from './support/open-compass-rig';
import { openDirectionDialog } from './support/open-direction-dialog';
import { useRig } from './support/use-rig';

const FACINGS = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

const framesIn = async (session: Session): Promise<number> => framesOf(session).getByRole('option').count();

const makesTheSet = async (session: Session): Promise<void> => {
  const dialog = await openDirectionDialog(session);
  for (const label of ['north west mirrors north east', 'west mirrors east', 'south west mirrors south east']) {
    await dialog.getByText(label, { exact: true }).click();
  }
  await dialog.getByRole('button', { name: 'Create' }).click();
  await dialog.waitFor({ state: 'detached' });
  await frameButton(session, 10).waitFor();
  expect(await framesIn(session)).toBe(10);
  await (await openFacing(session)).getByRole('button', { name: 'Face north west' }).waitFor();
  await session.page.keyboard.press('Escape');
};

const exportsEightGifs = async (session: Session): Promise<void> => {
  const files = await exportAnimationFiles(session, 'GIF', 8);
  expect(files.size).toBe(8);
  const stems = [...files.keys()].map((name) => name.replace(/\.gif$/, ''));
  for (const facing of FACINGS) expect(stems.some((stem) => stem.endsWith(`_${facing}`)), `a GIF for ${facing} in ${stems.join(', ')}`).toBe(true);
  for (const bytes of files.values()) expect(String.fromCharCode(...bytes.subarray(0, 6))).toMatch(/^GIF8[79]a$/);
};

const drawsAMirroredFacing = async (session: Session): Promise<void> => {
  const pad = await openFacing(session);
  await pad.getByRole('button', { name: 'Face west' }).click();
  await pad.getByRole('button', { name: 'Draw this facing' }).click();
  await frameButton(session, 12).waitFor();
  expect(await framesIn(session)).toBe(12);
  await expect(pad.getByRole('button', { name: 'Draw this facing' }).isDisabled()).resolves.toBe(true);
  await session.page.keyboard.press('Escape');
  const files = await exportAnimationFiles(session, 'GIF', 8);
  expect(files.size).toBe(8);
};

const makesALiveSheet = async (session: Session): Promise<void> => {
  await openMore(session, 'Transform animation', 'Make spritesheet');
  await session.page.getByRole('tablist', { name: 'Open assets' }).getByRole('tab', { name: /compass sheet/ }).waitFor();
};

describe('a direction set with mirrored facings', () => {
  const rig = useRig(openCompassRig);
  test('New direction set makes a tag for each of the eight facings, three of them mirrors', () => makesTheSet(rig().session));
  test('exports one GIF for each of the eight facings', () => exportsEightGifs(rig().session));
  test('Draw this facing turns a mirror into frames of its own and still exports eight GIFs', () => drawsAMirroredFacing(rig().session));
  test('Make spritesheet opens a sheet that follows the animation', () => makesALiveSheet(rig().session));
});

/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { frameButton, framesOf, openAnimationTab, timelineOf } from './support/animation-ui';
import { ANIMATION_COLORS } from './support/animation.constants';
import { dropFiles } from './support/drop-files';
import type { Session } from './support/e2e.type';
import { openCompassRig } from './support/open-compass-rig';
import { openDirectionDialog } from './support/open-direction-dialog';
import { openStripRig } from './support/open-strip-rig';
import { pngBytes } from './support/png-bytes';
import { STRIP } from './support/strip-project.constants';
import { useRig } from './support/use-rig';

const SIDE = STRIP.side;

const paletteColour = (slot: number): number[] => {
  const hex = ANIMATION_COLORS[slot]?.rgb ?? '#000000';
  return [1, 3, 5].map((at) => Number.parseInt(hex.slice(at, at + 2), 16)).concat(255);
};

const framesIn = (session: Session): Promise<number> => framesOf(session).getByRole('option').count();

const dropsAnImageFrame = async (session: Session): Promise<void> => {
  await openAnimationTab(session, STRIP.animation);
  await frameButton(session, 1).waitFor();
  await dropFiles(session.page, framesOf(session), [{ name: 'frame.png', bytes: pngBytes(SIDE, SIDE, paletteColour(2)) }]);
  await frameButton(session, 2).waitFor();
  expect(await framesIn(session)).toBe(2);
};

const refusesAnImageOfAnotherSize = async (session: Session): Promise<void> => {
  await dropFiles(session.page, framesOf(session), [{ name: 'big.png', bytes: pngBytes(SIDE * 2, SIDE * 2, paletteColour(2)) }]);
  const refused = session.page.locator('.frame-track[data-refused]');
  await refused.waitFor();
  expect(await refused.getAttribute('data-refused')).toContain(`This image is ${SIDE * 2} by ${SIDE * 2}`);
  expect(await framesIn(session)).toBe(2);
  await refused.waitFor({ state: 'detached' });
};

const refusesColoursOutsideThePalette = async (session: Session): Promise<void> => {
  await dropFiles(session.page, framesOf(session), [{ name: 'odd.png', bytes: pngBytes(SIDE, SIDE, [1, 2, 3, 255]) }]);
  const refused = session.page.locator('.frame-track[data-refused]');
  await refused.waitFor();
  expect(await refused.getAttribute('data-refused')).toContain('not in the palette');
  expect(await framesIn(session)).toBe(2);
};

const opensTheStripDialogForAStrip = async (session: Session): Promise<void> => {
  await session.page.locator('.frame-track[data-refused]').waitFor({ state: 'detached' });
  await dropFiles(session.page, framesOf(session), [{ name: 'run.png', bytes: pngBytes(SIDE * 3, SIDE, paletteColour(3)) }]);
  const dialog = session.page.getByRole('dialog', { name: 'Add frames from a strip image' });
  await dialog.waitFor();
  await dialog.getByRole('button', { name: 'Add frames' }).click();
  await dialog.waitFor({ state: 'detached' });
  await frameButton(session, 5).waitFor();
  expect(await framesIn(session)).toBe(5);
};

describe('dropping image files on the frame track', () => {
  const rig = useRig(openStripRig);
  test('an image the size of the animation becomes the next frame', () => dropsAnImageFrame(rig().session));
  test('an image of another size is refused with its reason and the danger state', () => refusesAnImageOfAnotherSize(rig().session));
  test('an image with colours outside the palette is refused', () => refusesColoursOutsideThePalette(rig().session));
  test('a strip image opens the strip dialog and adds one frame for each cell', () => opensTheStripDialogForAStrip(rig().session));
});

const laneCount = (session: Session): Promise<number> => timelineOf(session).locator('[data-tag-lane]').count();

const makesEightFacings = async (session: Session): Promise<void> => {
  const dialog = await openDirectionDialog(session);
  await dialog.getByRole('button', { name: 'Create' }).click();
  await dialog.waitFor({ state: 'detached' });
  await frameButton(session, 16).waitFor();
};

const toggleGrouping = async (session: Session): Promise<void> => {
  await timelineOf(session).getByRole('button', { name: 'More timeline actions' }).click();
  await session.page.getByRole('menuitemcheckbox', { name: 'Group by facing', exact: true }).click();
};

const groupsTheLanesByFacing = async (session: Session): Promise<void> => {
  await makesEightFacings(session);
  const stacked = await laneCount(session);
  await toggleGrouping(session);
  expect(await laneCount(session)).toBe(9);
  expect(stacked).toBeLessThan(9);
  await toggleGrouping(session);
  expect(await laneCount(session)).toBe(stacked);
};

describe('grouping the tag lanes by facing', () => {
  const rig = useRig(openCompassRig);
  test('one lane for each facing, and the lanes stack again when it is turned off', () => groupsTheLanesByFacing(rig().session));
});

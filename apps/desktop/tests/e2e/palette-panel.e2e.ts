/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { drawStroke } from './support/draw-stroke';
import { SHORTCUT } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { expectAccessible } from './support/expect-accessible';
import { nothingToUndo } from './support/nothing-to-undo';
import { openSpriteRig } from './support/open-sprite-rig';
import { pickSwatch } from './support/pick-swatch';
import { readSwatches } from './support/read-swatches';
import { sampleCanvas } from './support/sample-canvas';
import type { SpriteRig } from './support/sprite-rig.type';
import { useRig } from './support/use-rig';

const CELLS = [{ x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }];

const grid = (session: Session) => session.page.getByRole('listbox', { name: 'Palette swatches' });

const panel = (session: Session) => session.page.getByRole('region', { name: 'Palette' });

const swatch = (session: Session, index: number) => grid(session).getByRole('option', { name: new RegExp(`^Swatch ${index},`) });

const isFocused = (session: Session, index: number): Promise<boolean> => swatch(session, index).evaluate((node) => node === document.activeElement);

const holdsFocus = (session: Session): Promise<boolean> => grid(session).evaluate((node) => node.contains(document.activeElement));

const focusByKeys = async (session: Session, index: number): Promise<void> => {
  await session.page.keyboard.press('Insert');
  await swatch(session, index).focus();
};

const tabsOnce = async ({ session }: SpriteRig): Promise<void> => {
  await session.page.emulateMedia({ reducedMotion: 'reduce' });
  await pickSwatch(session, 2);
  await expect.poll(() => grid(session).locator('[tabindex="0"]').count()).toBe(1);
  await focusByKeys(session, 2);
  await session.page.keyboard.press('ArrowRight');
  await expect.poll(() => isFocused(session, 3)).toBe(true);
  await session.page.keyboard.press('Tab');
  await expect.poll(() => holdsFocus(session)).toBe(false);
  await session.page.keyboard.press('Shift+Tab');
  await expect.poll(() => isFocused(session, 3)).toBe(true);
};

const movesByKeys = async ({ session, map }: SpriteRig): Promise<void> => {
  await pickSwatch(session, 5);
  await drawStroke(session, map, CELLS);
  const before = await sampleCanvas(session, CELLS.map(map));
  const order = await readSwatches(session);
  await focusByKeys(session, 5);
  await swatch(session, 5).dispatchEvent('keydown', { key: 'ArrowRight', altKey: true, bubbles: true });
  await expect.poll(async () => (await readSwatches(session))[6]).toBe(order[5]);
  expect(await sampleCanvas(session, CELLS.map(map))).toEqual(before);
  await session.page.keyboard.press(SHORTCUT.undo);
  await expect.poll(() => readSwatches(session)).toEqual(order);
  expect(await sampleCanvas(session, CELLS.map(map))).toEqual(before);
};

const cancelsEdit = async ({ session, map }: SpriteRig): Promise<void> => {
  const empty = await nothingToUndo(session);
  const before = await sampleCanvas(session, CELLS.map(map));
  await swatch(session, 4).dblclick();
  const editor = session.page.getByRole('dialog', { name: 'Edit the colour of swatch 4' });
  await editor.waitFor();
  await expectAccessible(session, 'palette colour editor');
  await editor.getByRole('textbox', { name: 'Hex' }).fill('123456');
  await session.page.keyboard.press('Escape');
  await editor.waitFor({ state: 'detached' });
  expect(await sampleCanvas(session, CELLS.map(map))).toEqual(before);
  expect(await nothingToUndo(session)).toBe(empty);
};

const buildsRamp = async ({ session }: SpriteRig): Promise<void> => {
  await panel(session).getByRole('radio', { name: 'Ramps' }).click();
  await panel(session).getByRole('button', { name: 'New ramp...' }).click();
  const dialog = session.page.getByRole('dialog', { name: 'New ramp' });
  await dialog.waitFor();
  await expectAccessible(session, 'ramp builder');
  await dialog.getByRole('button', { name: 'Add ramp' }).click();
  await dialog.waitFor({ state: 'detached' });
  const row = panel(session).getByRole('group', { name: 'Ramp 1' });
  await row.waitFor();
  await expectAccessible(session, 'palette ramps view');
  await session.page.keyboard.press(SHORTCUT.undo);
  await row.waitFor({ state: 'detached' });
  await panel(session).getByRole('radio', { name: 'Grid' }).click();
};

const auditsViews = async ({ session }: SpriteRig): Promise<void> => {
  await expectAccessible(session, 'palette grid');
  await panel(session).getByRole('radio', { name: 'List' }).click();
  await panel(session).getByRole('table', { name: 'Palette swatch list' }).waitFor();
  await expectAccessible(session, 'palette list view');
  await panel(session).getByRole('radio', { name: 'Grid' }).click();
};

describe('the palette panel', () => {
  const rig = useRig(openSpriteRig);
  test('Tab enters the grid once and the arrows move the focus', () => tabsOnce(rig()));
  test('Alt+Right moves swatch 5 to 6, the drawing looks the same, one undo restores it', () => movesByKeys(rig()));
  test('Escape in the colour editor changes nothing and leaves the history alone', () => cancelsEdit(rig()));
  test('the ramp builder adds a ramp in one undo step and the ramps view shows it', () => buildsRamp(rig()));
  test('the grid and the list view pass the accessibility audit', () => auditsViews(rig()));
});

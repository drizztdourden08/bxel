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
import { useRig } from './support/use-rig';

const CELLS = [{ x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }];

const grid = (session: Session) => session.page.getByRole('listbox', { name: 'Palette swatches' });

const swatch = (session: Session, index: number) => grid(session).getByRole('option', { name: new RegExp(`^Swatch ${index},`) });

describe('the palette panel', () => {
  const rig = useRig(openSpriteRig);

  test('Tab enters the grid once and the arrows move the focus', async () => {
    const { session } = rig();
    await pickSwatch(session, 2);
    await expect.poll(() => grid(session).locator('[tabindex="0"]').count()).toBe(1);
    await session.page.keyboard.press('ArrowRight');
    await expect.poll(() => swatch(session, 3).evaluate((node) => node === document.activeElement)).toBe(true);
    await session.page.keyboard.press('Tab');
    await expect.poll(() => grid(session).evaluate((node) => node.contains(document.activeElement))).toBe(false);
  });

  test('Alt+Right moves swatch 5 to 6, the drawing looks the same, one undo restores it', async () => {
    const { session, map } = rig();
    await pickSwatch(session, 5);
    await drawStroke(session, map, CELLS);
    const before = await sampleCanvas(session, CELLS.map(map));
    const order = await readSwatches(session);
    await swatch(session, 5).focus();
    await session.page.keyboard.press('Alt+ArrowRight');
    await expect.poll(async () => (await readSwatches(session))[6]).toBe(order[5]);
    expect(await sampleCanvas(session, CELLS.map(map))).toEqual(before);
    await session.page.keyboard.press(SHORTCUT.undo);
    await expect.poll(() => readSwatches(session)).toEqual(order);
    expect(await sampleCanvas(session, CELLS.map(map))).toEqual(before);
  });

  test('Escape in the colour editor changes nothing and leaves the history alone', async () => {
    const { session, map } = rig();
    await session.page.keyboard.press(SHORTCUT.undo);
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
  });

  test('the ramp builder adds a ramp in one undo step and the ramps view shows it', async () => {
    const { session } = rig();
    const panel = session.page.getByRole('region', { name: 'Palette' });
    await panel.getByRole('radio', { name: 'Ramps' }).click();
    await panel.getByRole('button', { name: 'New ramp...' }).click();
    const dialog = session.page.getByRole('dialog', { name: 'New ramp' });
    await dialog.waitFor();
    await expectAccessible(session, 'ramp builder');
    await dialog.getByRole('button', { name: 'Add ramp' }).click();
    await dialog.waitFor({ state: 'detached' });
    await panel.getByRole('group', { name: 'Ramp 1' }).waitFor();
    await expectAccessible(session, 'palette ramps view');
    await session.page.keyboard.press(SHORTCUT.undo);
    await panel.getByRole('group', { name: 'Ramp 1' }).waitFor({ state: 'detached' });
    await panel.getByRole('radio', { name: 'Grid' }).click();
  });

  test('the list view and the grid pass the accessibility audit', async () => {
    const { session } = rig();
    const panel = session.page.getByRole('region', { name: 'Palette' });
    await expectAccessible(session, 'palette grid');
    await panel.getByRole('radio', { name: 'List' }).click();
    await panel.getByRole('table', { name: 'Palette swatch list' }).waitFor();
    await expectAccessible(session, 'palette list view');
    await panel.getByRole('radio', { name: 'Grid' }).click();
  });
});

/* @layer renderer-app @kind test */
import type { Locator } from 'playwright-core';
import { describe, expect, test } from 'vitest';
import { addLayer } from './support/add-layer';
import { SHORTCUT } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { layerRow } from './support/layer-row';
import { openSpriteRig } from './support/open-sprite-rig';
import { useRig } from './support/use-rig';

const NAMES = ['Layer 1', 'Layer 2', 'Layer 3', 'Layer 4'];

const toggle = (session: Session, layer: string, name: 'Visible' | 'Locked'): Locator =>
  session.page.getByRole('group', { name: layer, exact: true }).getByRole('button', { name, exact: true });

const pressed = async (session: Session, layer: string, name: 'Visible' | 'Locked'): Promise<string | null> =>
  toggle(session, layer, name).getAttribute('aria-pressed');

const states = async (session: Session, name: 'Visible' | 'Locked'): Promise<(string | null)[]> =>
  Promise.all(NAMES.map((layer) => pressed(session, layer, name)));

const sweepDown = async (session: Session, column: 'Visible' | 'Locked', from: string, to: string): Promise<void> => {
  const start = await toggle(session, from, column).boundingBox();
  const end = await toggle(session, to, column).boundingBox();
  if (!start || !end) throw new Error('the toggles are not on screen');
  await session.page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await session.page.mouse.down();
  await session.page.mouse.move(end.x + end.width / 2, end.y + end.height / 2, { steps: 8 });
  await session.page.mouse.up();
};

describe('the layer list', () => {
  const rig = useRig(openSpriteRig);

  test('lists a thumbnail, the eye and the lock for each layer, and adds layers', async () => {
    const { session } = rig();
    for (const name of NAMES.slice(1)) await addLayer(session, name);
    const rows = session.page.getByRole('list', { name: 'Layers' }).getByRole('listitem');
    await expect.poll(() => rows.count()).toBe(NAMES.length);
    await expect.poll(() => states(session, 'Visible')).toEqual(NAMES.map(() => 'true'));
  });

  test('renames in the row with F2, keeps on Enter, and shows why a taken name is refused', async () => {
    const { session } = rig();
    await layerRow(session, 'Layer 4').focus();
    await session.page.keyboard.press('F2');
    const field = session.page.getByRole('textbox', { name: 'Rename Layer 4' });
    await field.fill('layer 1');
    await field.press('Enter');
    await session.page.getByText('That name is already used. Choose another name.').waitFor();
    await field.fill('Hat');
    await field.press('Enter');
    await layerRow(session, 'Hat').waitFor();
    await session.page.keyboard.press(SHORTCUT.undo);
    await layerRow(session, 'Layer 4').waitFor();
  });

  test('a drag down the eye column hides every row it passes as one undo step', async () => {
    const { session } = rig();
    await sweepDown(session, 'Visible', 'Layer 4', 'Layer 2');
    await expect.poll(() => states(session, 'Visible')).toEqual(['true', 'false', 'false', 'false']);
    await session.page.keyboard.press(SHORTCUT.undo);
    await expect.poll(() => states(session, 'Visible')).toEqual(NAMES.map(() => 'true'));
  });

  test('Alt and click on the eye shows only that layer, and again brings the others back', async () => {
    const { session } = rig();
    await toggle(session, 'Layer 2', 'Visible').click({ modifiers: ['Alt'] });
    await expect.poll(() => states(session, 'Visible')).toEqual(['false', 'true', 'false', 'false']);
    await toggle(session, 'Layer 2', 'Visible').click({ modifiers: ['Alt'] });
    await expect.poll(() => states(session, 'Visible')).toEqual(NAMES.map(() => 'true'));
  });

  test('tags a layer with a colour and locks its transparency from the strip', async () => {
    const { session } = rig();
    await layerRow(session, 'Layer 3').click();
    await session.page.getByRole('button', { name: 'Colour Rose', exact: true }).click();
    await expect(session.page.getByRole('button', { name: /^Layer 3, Rose/ })).toBeVisible();
    await session.page.getByRole('radio', { name: 'Lock transparency' }).click();
    await expect.poll(() => pressed(session, 'Layer 3', 'Locked')).toBe('true');
    await session.page.getByRole('radio', { name: 'Unlocked' }).click();
    await expect.poll(() => pressed(session, 'Layer 3', 'Locked')).toBe('false');
  });

  test('picks several rows with Shift and Ctrl and deletes them together', async () => {
    const { session } = rig();
    await layerRow(session, 'Layer 1').click();
    await layerRow(session, 'Layer 3').click({ modifiers: ['Shift'] });
    await session.page.getByRole('button', { name: 'Delete layer', exact: true }).click();
    await expect.poll(() => session.page.getByRole('list', { name: 'Layers' }).getByRole('listitem').count()).toBe(1);
    await session.page.keyboard.press(SHORTCUT.undo);
    await expect.poll(() => session.page.getByRole('list', { name: 'Layers' }).getByRole('listitem').count()).toBe(NAMES.length);
  });
});

/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { MARKS_SIDE } from './support/marks.constants';
import { openTransformRig } from './support/open-transform-rig';
import { turnGrid } from './support/turn-grid';
import { useRig } from './support/use-rig';

describe('selection and transform', () => {
  const rig = useRig(openTransformRig);

  test('Mod+T opens the transform bar with its fields and handles, and Escape restores the pixels', async () => {
    const { session, original, shownNow } = rig();
    await session.page.keyboard.press('Control+t');
    const fields = session.page.getByRole('group', { name: 'Transform' });
    await fields.waitFor();
    for (const name of ['X', 'Y', 'W', 'H', 'Angle']) await fields.getByRole('spinbutton', { name, exact: true }).waitFor();
    await session.page.keyboard.press('Escape');
    await fields.waitFor({ state: 'detached' });
    expect([...(await shownNow())]).toEqual([...original]);
  });

  test('typing 90 degrees in the bar and applying is one undo step and equals the quarter turn', async () => {
    const { session, original, shownNow } = rig();
    await session.page.keyboard.press('Control+t');
    const fields = session.page.getByRole('group', { name: 'Transform' });
    await fields.getByRole('spinbutton', { name: 'Angle', exact: true }).fill('90');
    await fields.getByRole('button', { name: 'Apply', exact: true }).click();
    await fields.waitFor({ state: 'detached' });
    expect([...(await shownNow())]).toEqual([...turnGrid(original, MARKS_SIDE)]);
    await session.page.keyboard.press('Control+z');
    expect([...(await shownNow())]).toEqual([...original]);
  });

  test('the saved selections dialog keeps a named selection for the file', async () => {
    const { session } = rig();
    await session.page.getByRole('application', { name: /canvas/i }).first().focus();
    await session.page.keyboard.press('Control+a');
    await session.page.getByRole('button', { name: 'Menu', exact: true }).click();
    await session.page.getByRole('menuitem', { name: /^Select$/ }).first().click();
    await session.page.getByRole('menuitem', { name: /^Saved selections/ }).first().click();
    const dialog = session.page.getByRole('dialog', { name: 'Saved selections' });
    await dialog.getByRole('textbox', { name: 'Name' }).fill('everything');
    await dialog.getByRole('button', { name: 'Save selection' }).click();
    await dialog.getByRole('listitem').filter({ hasText: 'everything' }).waitFor();
    await dialog.getByRole('button', { name: 'Close', exact: true }).last().click();
  });
});

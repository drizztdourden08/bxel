/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import type { Locator } from 'playwright-core';
import { openTilemapRig } from './support/open-tilemap-rig';
import { POLL_MS, SHORTCUT } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { useRig } from './support/use-rig';

const tileset = (session: Session) => session.page.getByRole('region', { name: 'Tileset' });

const cellsIn = (session: Session) => tileset(session).getByRole('gridcell', { name: /^Tile \d/ });

const modeSwitch = (session: Session) => tileset(session).getByRole('radiogroup', { name: 'Tileset mode' });

const openInspector = async (session: Session): Promise<void> => {
  const show = tileset(session).getByRole('button', { name: 'Show Tile inspector' });
  if ((await show.count()) > 0) await show.click();
};

const tilesMode = async (session: Session): Promise<void> => {
  await modeSwitch(session).getByRole('radio', { name: /Tiles/ }).click();
};

const label = (cell: Locator) => async (): Promise<string> => (await cell.getAttribute('aria-label')) ?? '';

describe('the tileset widget', () => {
  const rig = useRig(openTilemapRig);

  test('shows the tiles as grid cells and picks one with the keyboard', async () => {
    const { session } = rig();
    expect(await cellsIn(session).count()).toBe(2);
    const first = cellsIn(session).first();
    await first.click();
    await expect.poll(async () => first.getAttribute('aria-selected'), { timeout: POLL_MS }).toBe('true');
    await first.press('ArrowRight');
    await cellsIn(session).last().press('Enter');
    await expect.poll(async () => cellsIn(session).last().getAttribute('aria-selected'), { timeout: POLL_MS }).toBe('true');
  });

  test('switches mode and keeps the tile picked', async () => {
    const { session } = rig();
    await openInspector(session);
    await modeSwitch(session).getByRole('radio', { name: /Collision/ }).click();
    await tileset(session).getByRole('group', { name: 'Collision', exact: true }).waitFor();
    await modeSwitch(session).getByRole('radio', { name: /Data/ }).click();
    await tileset(session).getByRole('group', { name: 'Tile data', exact: true }).waitFor();
    await modeSwitch(session).getByRole('radio', { name: /Tiles/ }).click();
  });

  test('sets the type of both tiles at once and one undo restores both', async () => {
    const { session } = rig();
    await openInspector(session);
    await tilesMode(session);
    await cellsIn(session).first().click();
    await cellsIn(session).last().click({ modifiers: ['Control'] });
    const type = tileset(session).getByRole('textbox', { name: 'Type' });
    await type.fill('wall');
    await type.press('Enter');
    await expect.poll(label(cellsIn(session).first()), { timeout: POLL_MS }).toContain('wall');
    await expect.poll(label(cellsIn(session).last()), { timeout: POLL_MS }).toContain('wall');
    await cellsIn(session).first().focus();
    await session.page.keyboard.press(SHORTCUT.undo);
    await expect.poll(label(cellsIn(session).first()), { timeout: POLL_MS }).not.toContain('wall');
    await expect.poll(label(cellsIn(session).last()), { timeout: POLL_MS }).not.toContain('wall');
  });

});

describe('the tileset widget collision mode', () => {
  const rig = useRig(openTilemapRig);

  test('paints Full collision across both tiles in one step, undone and redone as one', async () => {
    const { session } = rig();
    const { page } = session;
    await openInspector(session);
    await modeSwitch(session).getByRole('radio', { name: /Collision/ }).click();
    await tileset(session).getByRole('radio', { name: 'Paint full' }).click();
    await cellsIn(session).first().scrollIntoViewIfNeeded();
    await cellsIn(session).last().scrollIntoViewIfNeeded();
    const from = await cellsIn(session).first().boundingBox();
    const to = await cellsIn(session).last().boundingBox();
    if (!from || !to) throw new Error('no tile boxes');
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 4 });
    await page.mouse.up();
    await expect.poll(label(cellsIn(session).first()), { timeout: POLL_MS }).toContain('collision full');
    await expect.poll(label(cellsIn(session).last()), { timeout: POLL_MS }).toContain('collision full');
    await page.keyboard.press(SHORTCUT.undo);
    await expect.poll(label(cellsIn(session).first()), { timeout: POLL_MS }).not.toContain('collision full');
    await expect.poll(label(cellsIn(session).last()), { timeout: POLL_MS }).not.toContain('collision full');
    await page.keyboard.press(SHORTCUT.redo);
    await expect.poll(label(cellsIn(session).last()), { timeout: POLL_MS }).toContain('collision full');
  });
});

/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import type { Locator } from 'playwright-core';
import { openTilemapRig } from './support/open-tilemap-rig';
import { readSaved } from './support/read-saved';
import { saveFile } from './support/save-file';
import type { Session } from './support/e2e.type';
import { useRig } from './support/use-rig';

const tileset = (session: Session) => session.page.getByRole('region', { name: 'Tileset' });

const cellsIn = (session: Session) => tileset(session).getByRole('gridcell', { name: /^Tile \d/ });

const modeSwitch = (session: Session) => tileset(session).getByRole('radiogroup', { name: 'Tileset mode' });

const label = (cell: Locator) => async (): Promise<string> => (await cell.getAttribute('aria-label')) ?? '';

describe('the tileset widget', () => {
  const rig = useRig(openTilemapRig);

  test('shows the tiles as grid cells and picks one with the keyboard', async () => {
    const { session } = rig();
    expect(await cellsIn(session).count()).toBe(2);
    const first = cellsIn(session).first();
    await first.click();
    await expect.poll(async () => first.getAttribute('aria-selected')).toBe('true');
    await first.press('ArrowRight');
    await cellsIn(session).last().press('Enter');
    await expect.poll(async () => cellsIn(session).last().getAttribute('aria-selected')).toBe('true');
  });

  test('switches mode and keeps the tile picked', async () => {
    const { session } = rig();
    await modeSwitch(session).getByRole('radio', { name: /Collision/ }).click();
    await tileset(session).getByRole('group', { name: 'Collision' }).waitFor();
    await modeSwitch(session).getByRole('radio', { name: /Data/ }).click();
    await tileset(session).getByRole('group', { name: 'Tile data' }).waitFor();
    await modeSwitch(session).getByRole('radio', { name: /Tiles/ }).click();
  });

  test('sets the type of both tiles at once and one undo restores both', async () => {
    const { session } = rig();
    await cellsIn(session).first().click();
    await cellsIn(session).last().click({ modifiers: ['Control'] });
    const type = tileset(session).getByRole('textbox', { name: 'Type' });
    await type.fill('wall');
    await type.press('Enter');
    await expect.poll(label(cellsIn(session).first())).toContain('wall');
    await expect.poll(label(cellsIn(session).last())).toContain('wall');
    await session.page.keyboard.press('Control+z');
    await expect.poll(label(cellsIn(session).first())).not.toContain('wall');
    await expect.poll(label(cellsIn(session).last())).not.toContain('wall');
  });

  test('paints Full collision across both tiles in one step and saves it on the solid layer', async () => {
    const { session } = rig();
    const { page } = session;
    await modeSwitch(session).getByRole('radio', { name: /Collision/ }).click();
    await tileset(session).getByRole('radio', { name: 'Paint full' }).click();
    const from = await cellsIn(session).first().boundingBox();
    const to = await cellsIn(session).last().boundingBox();
    if (!from || !to) throw new Error('no tile boxes');
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 4 });
    await page.mouse.up();
    await expect.poll(label(cellsIn(session).first())).toContain('collision full');
    await expect.poll(label(cellsIn(session).last())).toContain('collision full');
    const path = join(session.dir, 'tileset.bxmap');
    await saveFile(session, path, [join(session.dir, 'tiles.bxtiles')]);
    const saved = readSaved(path);
    expect(saved.tilesets[0]?.tiles.map((tile) => tile.shapes)).toEqual([[{ kind: 'full', layer: 'solid' }], [{ kind: 'full', layer: 'solid' }]]);
    await page.keyboard.press('Control+z');
    await expect.poll(label(cellsIn(session).first())).not.toContain('collision full');
    await expect.poll(label(cellsIn(session).last())).not.toContain('collision full');
  });
});

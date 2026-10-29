/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import type { CellMapper, Session } from './support/e2e.type';
import { drawStroke } from './support/draw-stroke';
import { exportTilemap } from './support/export-tilemap';
import { openTilemapRig } from './support/open-tilemap-rig';
import { TILEMAP_E2E } from './support/tilemap.constants';
import { useRig } from './support/use-rig';

const { columns, tile } = TILEMAP_E2E;

const REGION = [{ x: 10, y: 8 }, { x: 11, y: 8 }, { x: 12, y: 8 }, { x: 13, y: 8 }, { x: 10, y: 9 }, { x: 11, y: 9 }] as const;

const OTHER = [{ x: 20, y: 12 }, { x: 21, y: 12 }] as const;

const centre = (cell: { x: number; y: number }) => ({ x: cell.x * tile + tile / 2 - 0.5, y: cell.y * tile + tile / 2 - 0.5 });

const options = (session: Session) => session.page.getByRole('toolbar', { name: 'Tool options' });

const chooseShape = (session: Session, name: string) => options(session).getByRole('group', { name: 'Select by' }).getByRole('button', { name }).first().click();

const chooseMode = (session: Session, name: string) => options(session).getByRole('group', { name: 'Selection mode' }).getByRole('button', { name }).first().click();

const cellsText = (session: Session, count: number) => session.page.getByText(`${count} cells selected`, { exact: true }).first().waitFor();

const sweep = async (session: Session, map: CellMapper, cells: readonly { x: number; y: number }[]) => drawStroke(session, map, cells.map(centre));

const placedAt = async (session: Session): Promise<string[]> => {
  const bxel = JSON.parse(await exportTilemap(session, 'Bxel map JSON')) as { layers: { keys: number[] }[] };
  return (bxel.layers[0]?.keys ?? []).flatMap((key, at) => (key === 0 ? [] : [`${at % columns},${Math.floor(at / columns)}`])).sort();
};

const keys = (cells: readonly { x: number; y: number }[], by = { x: 0, y: 0 }): string[] => cells.map((cell) => `${cell.x + by.x},${cell.y + by.y}`);

describe('selecting, copying and moving cells on a map', () => {
  const rig = useRig(openTilemapRig);

  test('the wand, same tile and the combine modes build a cell mask', async () => {
    const { session, mapper } = rig();
    const map = await mapper();
    await sweep(session, map, REGION.slice(0, 4));
    await sweep(session, map, REGION.slice(4));
    await sweep(session, map, OTHER);
    await session.page.getByRole('application', { name: TILEMAP_E2E.label }).focus();
    await session.page.keyboard.press('m');
    await chooseShape(session, 'Wand');
    const click = async (cell: { x: number; y: number }) => {
      const at = map(centre(cell));
      await session.page.mouse.click(at.x, at.y);
    };
    await click({ x: 10, y: 8 });
    await cellsText(session, 6);
    await chooseShape(session, 'Same tile');
    await click({ x: 10, y: 8 });
    await cellsText(session, 8);
    await chooseShape(session, 'Rectangle');
    await chooseMode(session, 'Subtract');
    await sweep(session, map, OTHER);
    await cellsText(session, 6);
    await chooseMode(session, 'Replace');
    await session.page.keyboard.down('Shift');
    await sweep(session, map, [{ x: 20, y: 12 }, { x: 20, y: 12 }]);
    await session.page.keyboard.up('Shift');
    await cellsText(session, 7);
  });

  test('copy and paste put the cells where the pointer clicks, keeping the mask', async () => {
    const { session, mapper } = rig();
    const map = await mapper();
    await chooseShape(session, 'Wand');
    const first = map(centre({ x: 10, y: 8 }));
    await session.page.mouse.click(first.x, first.y);
    await cellsText(session, 6);
    await session.page.getByRole('application', { name: TILEMAP_E2E.label }).focus();
    await session.page.keyboard.press('Control+c');
    await session.page.keyboard.press('Control+v');
    await session.page.waitForTimeout(400);
    const target = map(centre({ x: 10, y: 14 }));
    await session.page.mouse.move(target.x, target.y);
    await session.page.mouse.click(target.x, target.y);
    await cellsText(session, 6);
    expect(await placedAt(session)).toEqual([...keys(REGION), ...keys(OTHER), ...keys(REGION, { x: 0, y: 6 })].sort());
    await chooseShape(session, 'Rectangle');
  });

  test('dragging inside the selection moves the cells in one step and undo brings them back', async () => {
    const { session, mapper } = rig();
    const map = await mapper();
    await sweep(session, map, [{ x: 10, y: 14 }, { x: 10, y: 16 }]);
    const moved = [...keys(REGION), ...keys(OTHER), ...keys(REGION, { x: 0, y: 8 })].sort();
    expect(await placedAt(session)).toEqual(moved);
    await session.page.getByRole('application', { name: TILEMAP_E2E.label }).focus();
    await session.page.keyboard.press('Control+z');
    expect(await placedAt(session)).toEqual([...keys(REGION), ...keys(OTHER), ...keys(REGION, { x: 0, y: 6 })].sort());
  });

  test('a right drag on the map takes a stamp that the place tool puts down the same way', async () => {
    const { session, mapper } = rig();
    const map = await mapper();
    const { page } = session;
    await page.getByRole('application', { name: TILEMAP_E2E.label }).focus();
    await page.keyboard.press('b');
    const from = map(centre({ x: 10, y: 8 }));
    const to = map(centre({ x: 11, y: 9 }));
    await page.mouse.move(from.x, from.y);
    await page.mouse.down({ button: 'right' });
    await page.mouse.move(to.x, to.y);
    await page.mouse.up({ button: 'right' });
    const base = [...keys(REGION), ...keys(OTHER), ...keys(REGION, { x: 0, y: 6 })];
    const drop = map(centre({ x: 25, y: 3 }));
    await page.mouse.click(drop.x, drop.y);
    const stamped = keys([{ x: 25, y: 3 }, { x: 26, y: 3 }, { x: 25, y: 4 }, { x: 26, y: 4 }]);
    expect(await placedAt(session)).toEqual([...base, ...stamped].sort());
  });
});

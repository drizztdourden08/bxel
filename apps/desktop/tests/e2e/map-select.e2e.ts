/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import type { CellMapper, Session } from './support/e2e.type';
import { dragRight } from './support/drag-right';
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

type Rig = { readonly session: Session; readonly mapper: () => Promise<CellMapper> };

const PASTED = [...keys(REGION), ...keys(OTHER), ...keys(REGION, { x: 0, y: 6 })].sort();

const buildMask = async ({ session, mapper }: Rig): Promise<void> => {
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
};

const copyAndPaste = async ({ session, mapper }: Rig): Promise<void> => {
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
  expect(await placedAt(session)).toEqual(PASTED);
  await chooseShape(session, 'Rectangle');
};

const moveAndUndo = async ({ session, mapper }: Rig): Promise<void> => {
  const map = await mapper();
  await sweep(session, map, [{ x: 10, y: 14 }, { x: 10, y: 16 }]);
  expect(await placedAt(session)).toEqual([...keys(REGION), ...keys(OTHER), ...keys(REGION, { x: 0, y: 8 })].sort());
  await session.page.getByRole('application', { name: TILEMAP_E2E.label }).focus();
  await session.page.keyboard.press('Control+z');
  await session.page.keyboard.press('Control+z');
  expect(await placedAt(session)).toEqual(PASTED);
};

const captureStamp = async ({ session, mapper }: Rig): Promise<void> => {
  const map = await mapper();
  const { page } = session;
  await page.getByRole('application', { name: TILEMAP_E2E.label }).focus();
  await page.keyboard.press('b');
  await dragRight(session, map(centre({ x: 10, y: 8 })), map(centre({ x: 11, y: 9 })));
  const drop = map(centre({ x: 25, y: 3 }));
  await page.mouse.click(drop.x, drop.y);
  const stamped = keys([{ x: 25, y: 3 }, { x: 26, y: 3 }, { x: 25, y: 4 }, { x: 26, y: 4 }]);
  expect(await placedAt(session)).toEqual([...PASTED, ...stamped].sort());
};

describe('selecting, copying and moving cells on a map', () => {
  const rig = useRig(openTilemapRig);

  test('the wand, same tile and the combine modes build a cell mask', () => buildMask(rig()));

  test('copy and paste put the cells where the pointer clicks, keeping the mask', () => copyAndPaste(rig()));

  test('dragging inside the selection moves the cells in one step, and undo takes back the selection first and then the move', () => moveAndUndo(rig()));

  test('a right drag on the map takes a stamp that the place tool puts down the same way', () => captureStamp(rig()));
});

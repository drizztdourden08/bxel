/* @layer renderer-app @kind test */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { dragByPointer } from './support/drag-by-pointer';
import { LAYOUT_SETTLE } from './support/e2e.constants';
import { FOLDER_STRAY } from './support/folder-artwork.constants';
import { openTileRig } from './support/open-tile-rig';
import { runMenu } from './support/run-menu';
import type { TileRig } from './support/tile-rig.type';
import { useRig } from './support/use-rig';

const ORIGINAL = ['hero', 'slime', 'tiny', 'fx/glow', 'fx/spark'];

const grid = (rig: TileRig) => rig.session.page.getByRole('grid', { name: 'Sprites', exact: true });

const tile = (rig: TileRig, name: string) => grid(rig).getByRole('gridcell', { name: new RegExp(`^${name}$`) });

const shown = async (rig: TileRig): Promise<string[]> => {
  const labels = await grid(rig).getByRole('gridcell').evaluateAll((cells) => cells.map((cell) => cell.getAttribute('aria-label') ?? ''));
  return labels.map((label) => label.split(',')[0] ?? '');
};

const spriteFile = (rig: TileRig, name: string): string => join(dirname(rig.sheetFile), '..', 'sprites', `${name}.bxsprite`);

const savedNames = (rig: TileRig) => async (): Promise<readonly string[] | null> => (await rig.saved())?.names ?? null;

const savedWith = async (rig: TileRig, names: readonly string[]): Promise<void> => {
  await expect.poll(savedNames(rig), { timeout: 30000, interval: 500 }).toEqual(names);
};

const undoesToTheOriginal = async (rig: TileRig): Promise<void> => {
  await rig.session.page.keyboard.press('Control+z');
  await expect.poll(() => shown(rig)).toEqual(ORIGINAL);
  await savedWith(rig, ORIGINAL);
};

const startsOnTheSheet = async (rig: TileRig): Promise<void> => {
  await grid(rig).waitFor();
  await expect.poll(() => shown(rig)).toEqual(ORIGINAL);
  await savedWith(rig, ORIGINAL);
};

const REORDERED = ['hero', 'tiny', 'slime', 'fx/glow', 'fx/spark'];

const reordersATile = async (rig: TileRig): Promise<void> => {
  await dragByPointer(rig.session.page, tile(rig, 'tiny'), tile(rig, 'hero'));
  await expect.poll(() => shown(rig)).toEqual(REORDERED);
  await savedWith(rig, REORDERED);
  await undoesToTheOriginal(rig);
};

const liftTile = async (rig: TileRig, name: string): Promise<void> => {
  const { page } = rig.session;
  const from = await tile(rig, name).boundingBox();
  if (!from) throw new Error('the tile is not on the page');
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(from.x + from.width / 2 + 10, from.y + from.height / 2 + 10, { steps: 3 });
};

const dragsToTheDropBar = async (rig: TileRig): Promise<void> => {
  const { page } = rig.session;
  await liftTile(rig, 'tiny');
  const bar = page.locator('.sprites-panel__dropbar');
  await bar.waitFor();
  const box = await bar.boundingBox();
  if (!box) throw new Error('the drop bar is not on the page');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 8 });
  await expect.poll(() => bar.getAttribute('data-drop')).toBe('over');
  await page.mouse.up();
};

const removesToTheLibrary = async (rig: TileRig): Promise<void> => {
  await dragsToTheDropBar(rig);
  const without = ORIGINAL.filter((name) => name !== 'tiny');
  await expect.poll(() => shown(rig)).toEqual(without);
  await savedWith(rig, without);
  expect(existsSync(spriteFile(rig, 'tiny'))).toBe(true);
  await undoesToTheOriginal(rig);
};

const removesToTheOpenLibrary = async (rig: TileRig): Promise<void> => {
  const { page } = rig.session;
  const library = page.getByRole('grid', { name: 'Library', exact: true });
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await library.getByRole('gridcell', { name: new RegExp(`^${FOLDER_STRAY}$`) }).waitFor();
  await dragByPointer(page, tile(rig, 'slime'), library);
  const without = ORIGINAL.filter((name) => name !== 'slime');
  await expect.poll(() => shown(rig)).toEqual(without);
  await library.getByRole('gridcell', { name: /^slime$/ }).waitFor();
  await savedWith(rig, without);
  expect(existsSync(spriteFile(rig, 'slime'))).toBe(true);
  await undoesToTheOriginal(rig);
  await library.getByRole('gridcell', { name: /^slime$/ }).waitFor({ state: 'detached' });
};

const readPixel = async (rig: TileRig, point: { x: number; y: number }): Promise<{ x: number; y: number }> => {
  const { page } = rig.session;
  await page.mouse.move(point.x, point.y + 1);
  await page.mouse.move(point.x, point.y);
  const status = page.getByRole('region', { name: 'Editor status' });
  await expect.poll(() => status.innerText()).toMatch(/x -?\d+, y -?\d+/);
  const [, x, y] = /x (-?\d+), y (-?\d+)/.exec(await status.innerText()) ?? [];
  return { x: Number(x), y: Number(y) };
};

const pixelUnder = async (rig: TileRig, point: { x: number; y: number }): Promise<{ x: number; y: number }> => {
  let last = await readPixel(rig, point);
  let steady = 0;
  for (let attempt = 0; attempt < LAYOUT_SETTLE.attempts && steady < LAYOUT_SETTLE.steady; attempt += 1) {
    await rig.session.page.waitForTimeout(LAYOUT_SETTLE.gapMs);
    const next = await readPixel(rig, point);
    steady = next.x === last.x && next.y === last.y ? steady + 1 : 0;
    last = next;
  }
  return last;
};

const dragsTileTo = async (rig: TileRig, name: string, target: { x: number; y: number }): Promise<void> => {
  await liftTile(rig, name);
  await rig.session.page.mouse.move(target.x, target.y, { steps: 12 });
  await rig.session.page.mouse.up();
};

const placesATileOnTheCanvas = async (rig: TileRig): Promise<void> => {
  const { page } = rig.session;
  await runMenu(rig.session, [/^Sheet$/, /^Arrange/, /^By hand/]);
  await expect.poll(async () => (await rig.saved())?.layout, { timeout: 30000, interval: 500 }).toBe('manual');
  const before = await rig.saved();
  if (!before) throw new Error('the sheet was not saved');
  const box = await page.getByRole('application', { name: 'Sheet canvas' }).boundingBox();
  if (!box) throw new Error('the canvas is not on the page');
  const target = { x: box.x + box.width * 0.6, y: box.y + box.height * 0.3 };
  const pixel = await pixelUnder(rig, target);
  await dragsTileTo(rig, 'tiny', target);
  await expect.poll(async () => (await rig.saved())?.at['tiny'], { timeout: 30000, interval: 500 }).not.toEqual(before.at['tiny']);
  const after = await rig.saved();
  expect(after?.at['tiny']).toEqual({ x: Math.max(0, pixel.x), y: Math.max(0, pixel.y) });
  expect(after?.names).toEqual(before.names);
  await page.keyboard.press('Control+z');
  await expect.poll(async () => (await rig.saved())?.at['tiny'], { timeout: 30000, interval: 500 }).toEqual(before.at['tiny']);
};

describe('dragging the tiles of the sheet widget', () => {
  const rig = useRig(openTileRig);
  test('the sheet lists its tiles in the saved order', () => startsOnTheSheet(rig()));
  test('a tile dropped on another tile reorders the sheet and one undo restores the order', () => reordersATile(rig()));
  test('a tile dropped on the drop bar leaves the sheet, keeps its file, and one undo puts it back', () => removesToTheLibrary(rig()));
  test('a tile dropped on the open Library leaves the sheet, keeps its file, and one undo puts it back', () => removesToTheOpenLibrary(rig()));
  test('a tile dropped on the canvas in By hand layout is placed at the pointer and one undo restores it', () => placesATileOnTheCanvas(rig()));
});

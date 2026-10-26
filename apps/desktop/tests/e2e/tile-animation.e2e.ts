/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { ANIMATION_COLORS } from './support/animation.constants';
import { POLL_MS } from './support/e2e.constants';
import type { Cell, Session } from './support/e2e.type';
import { openTideRig } from './support/open-tide-rig';
import type { TideRig } from './support/open-tide-rig';
import { sampleCanvas } from './support/sample-canvas';
import { TIDE } from './support/tide.constants';
import { useRig } from './support/use-rig';

const COLOURS = TIDE.indexes.map((index) => ANIMATION_COLORS[index - 1]?.rgb);

const SAMPLES = 24;

const SAMPLE_GAP_MS = 40;

const tileset = (session: Session) => session.page.getByRole('region', { name: 'Tileset' });

const cellsAt = async (rig: TideRig, cells: readonly Cell[]): Promise<readonly Cell[]> => {
  const map = await rig.mapper();
  const middle = TIDE.side / 2;
  return cells.map((cell) => map({ x: cell.x * TIDE.side + middle, y: cell.y * TIDE.side + middle }));
};

const watch = async (rig: TideRig, cells: readonly Cell[]): Promise<string[][]> => {
  const points = await cellsAt(rig, cells);
  const seen: string[][] = [];
  for (let at = 0; at < SAMPLES; at += 1) {
    seen.push(await sampleCanvas(rig.session, points));
    await rig.session.page.waitForTimeout(SAMPLE_GAP_MS);
  }
  return seen;
};

const pickWater = async (session: Session): Promise<void> => {
  const tile = tileset(session).getByRole('button', { name: /^Tile 1,/ });
  await tile.waitFor();
  expect(await tile.getAttribute('aria-label')).toContain('Plays an animation');
  await tile.click();
  await tileset(session).getByText(`Plays ${TIDE.animation} (${TIDE.animation}.bxanim): 2 frames, ${TIDE.frameMs * 2} ms loop`).waitFor({ timeout: POLL_MS });
};

const plays = async (rig: TideRig): Promise<void> => {
  await pickWater(rig.session);
  const seen = (await watch(rig, [{ x: 1, y: 1 }])).flat();
  expect(new Set(seen)).toEqual(new Set(COLOURS));
};

const together = async (rig: TideRig): Promise<void> => {
  const samples = await watch(rig, [{ x: 0, y: 0 }, { x: 3, y: 0 }, { x: 1, y: 2 }, { x: 3, y: 2 }]);
  for (const row of samples) expect(new Set(row).size).toBe(1);
  expect(new Set(samples.flat()).size).toBe(2);
};

const everyCell = (): readonly Cell[] =>
  Array.from({ length: TIDE.columns * TIDE.rows }, (_unused, index) => ({ x: index % TIDE.columns, y: Math.floor(index / TIDE.columns) }));

const random = async (rig: TideRig): Promise<void> => {
  const { page } = rig.session;
  await tileset(rig.session).getByRole('combobox', { name: 'Start' }).click();
  await page.getByRole('option', { name: 'Random', exact: true }).click();
  await tileset(rig.session).getByRole('combobox', { name: 'Start' }).filter({ hasText: 'Random' }).waitFor();
  const samples = await watch(rig, everyCell());
  expect(samples.some((row) => new Set(row).size === 2)).toBe(true);
  expect(new Set(samples.flat()).size).toBe(2);
};

const stops = async (rig: TideRig): Promise<void> => {
  const { page } = rig.session;
  const toggle = page.getByRole('button', { name: 'Animate tiles' }).first();
  await toggle.click();
  await expect.poll(() => toggle.getAttribute('aria-pressed'), { timeout: POLL_MS }).not.toBe('true');
  const samples = (await watch(rig, [{ x: 1, y: 1 }])).flat();
  expect(new Set(samples).size).toBe(1);
  await toggle.click();
  await expect.poll(() => toggle.getAttribute('aria-pressed'), { timeout: POLL_MS }).toBe('true');
};

describe('animated tiles on a map', () => {
  const rig = useRig(openTideRig);
  test('plays the water of a tile and shows it in the tileset panel', () => plays(rig()));
  test('keeps every cell in step when the start is together', () => together(rig()));
  test('starts the cells apart, and repeatably, when the start is random', () => random(rig()));
  test('stands still when Animate tiles is turned off', () => stops(rig()));
});

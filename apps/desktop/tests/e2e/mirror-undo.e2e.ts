/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { chooseTiling } from './support/choose-tiling';
import { drawStroke } from './support/draw-stroke';
import { SHORTCUT } from './support/e2e.constants';
import type { Cell, CellMapper } from './support/e2e.type';
import { MARKS_SIDE } from './support/marks.constants';
import { openSpriteRig } from './support/open-sprite-rig';
import { readCopy } from './support/read-copy';
import { readSwatches } from './support/read-swatches';
import { useRig } from './support/use-rig';

const STROKE = [{ x: 3, y: 2 }, { x: 4, y: 3 }, { x: 5, y: 4 }, { x: 6, y: 5 }];

const EDGE_STROKES: readonly (readonly Cell[])[] = [
  [{ x: 15, y: 3 }, { x: 15, y: 4 }, { x: 14, y: 5 }],
  [{ x: 2, y: 15 }, { x: 3, y: 15 }, { x: 3, y: 14 }],
  [{ x: 0, y: 8 }, { x: 0, y: 9 }, { x: 1, y: 9 }],
  [{ x: 8, y: 0 }, { x: 9, y: 0 }, { x: 9, y: 1 }],
];

const SIZE = { width: MARKS_SIDE, height: MARKS_SIDE };

const COPIES: readonly Cell[] = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];

const MIN_EDGE_PIXELS = 2;

const filled = (grid: Uint8Array) => [...grid].flatMap((index, at) => (index === 0 ? [] : [`${at % MARKS_SIDE},${Math.floor(at / MARKS_SIDE)}`])).sort();

const shifted = (map: CellMapper, copy: Cell): CellMapper => (cell) => map({ x: cell.x + copy.x * MARKS_SIDE, y: cell.y + copy.y * MARKS_SIDE });

describe('check 3: symmetry and tiling', () => {
  const rig = useRig(openSpriteRig);

  test('a stroke across the mirror axis paints the opposite pixels and undoes in one step', async () => {
    const { session, map, shown } = rig();
    await session.page.getByRole('button', { name: /^Mirror X/ }).click();
    await drawStroke(session, map, STROKE);
    const expected = STROKE.flatMap((cell) => [`${cell.x},${cell.y}`, `${MARKS_SIDE - 1 - cell.x},${cell.y}`]).sort();
    expect(filled(await shown())).toEqual(expected);
    await session.page.keyboard.press(SHORTCUT.undo);
    expect(filled(await shown())).toEqual([]);
    expect(await session.page.getByRole('button', { name: 'Nothing to undo' }).count()).toBe(1);
    await session.page.keyboard.press(SHORTCUT.redo);
    expect(filled(await shown())).toEqual(expected);
    await session.page.getByRole('button', { name: /^Mirror X/ }).click();
    await session.page.keyboard.press(SHORTCUT.undo);
  });

  test('the tiled view repeats the edge pixels across every boundary and turns off again', async () => {
    const { session, map, shown, remap } = rig();
    for (const stroke of EDGE_STROKES) await drawStroke(session, map, stroke);
    const base = await shown();
    expect(filled(base)).toEqual(EDGE_STROKES.flat().map((cell) => `${cell.x},${cell.y}`).sort());
    const swatches = await readSwatches(session);
    await chooseTiling(session, /^Both/);
    await session.page.keyboard.press('Minus');
    await session.page.keyboard.press('Minus');
    const far = await remap();
    for (const copy of COPIES) {
      const seen = await readCopy(session, shifted(far, copy), SIZE, swatches);
      const edge = [...seen].filter(([at]) => base[at] !== 0);
      expect(edge.length, `copy ${copy.x},${copy.y} shows edge pixels`).toBeGreaterThanOrEqual(MIN_EDGE_PIXELS);
      for (const [at, index] of seen) expect(index, `copy ${copy.x},${copy.y} cell ${at}`).toBe(base[at]);
    }
    await chooseTiling(session, /^Off/);
    const off = await readCopy(session, shifted(await remap(), COPIES[0] ?? { x: 1, y: 0 }), SIZE, swatches);
    expect(new Set(off.values()).size, 'with tiling off the neighbour area is plain background').toBe(1);
  });
});

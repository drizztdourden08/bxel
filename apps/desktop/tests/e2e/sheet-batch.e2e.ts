/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { applyTransform } from './support/apply-transform';
import { drawStroke } from './support/draw-stroke';
import { SHORTCUT } from './support/e2e.constants';
import { flipGrid } from './support/flip-grid';
import { openSheetRig, PART_NAMES } from './support/open-sheet-rig';
import { PADDED_MARKS, PADDED_SHEET } from './support/padded-sheet.constants';
import { pickSwatch } from './support/pick-swatch';
import type { SheetRig } from './support/sheet-rig.type';
import { turnGrid } from './support/turn-grid';
import { useRig } from './support/use-rig';

const SIDE = PADDED_SHEET.cell;

const INK = 2;

const STROKE = [1, 2, 3, 4].map((x) => ({ x, y: 5 }));

const held: { start: Uint8Array[]; stroked: Uint8Array[] } = { start: [], stroked: [] };

const inked = (grid: Uint8Array): Uint8Array => {
  const next = Uint8Array.from(grid);
  for (const cell of STROKE) next[cell.y * SIDE + cell.x] = INK;
  return next;
};

const same = async (rig: SheetRig, expected: readonly Uint8Array[]): Promise<void> => {
  await rig.saveAll();
  await expect.poll(() => rig.parts().map((part) => [...part]), { timeout: 15000 }).toEqual(expected.map((part) => [...part]));
};

const selectAll = async (rig: SheetRig): Promise<void> => {
  const sprites = rig.session.page.getByRole('group', { name: 'Sprites', exact: true });
  await sprites.getByRole('button', { name: /^part_01/ }).click();
  await sprites.getByRole('button', { name: /^part_02/ }).click({ modifiers: ['Control'] });
  await sprites.getByRole('button', { name: /^part_03/ }).click({ modifiers: ['Control'] });
};

const slicesTheGrid = async (rig: SheetRig): Promise<void> => {
  await rig.saveAll();
  await expect.poll(() => rig.parts().length, { timeout: 15000 }).toBe(PART_NAMES.length);
  held.start = rig.parts();
  held.start.forEach((part, at) => {
    const marks = PADDED_MARKS[at] ?? [];
    const painted = [...part].flatMap((index, cell) => (index === 0 ? [] : [`${cell % SIDE},${Math.floor(cell / SIDE)}`])).sort();
    expect(painted, `${PART_NAMES[at]} keeps only its own cell`).toEqual(marks.map((mark) => `${mark.x},${mark.y}`).sort());
  });
  expect(new Set(held.start.map((part) => part.join(','))).size).toBe(PART_NAMES.length);
};

const paintsOneSharedStroke = async (rig: SheetRig): Promise<void> => {
  const { page } = rig.session;
  await selectAll(rig);
  await page.getByRole('button', { name: 'Sprites: 3 selected' }).waitFor();
  await page.keyboard.press('Alt+1');
  await page.keyboard.press('Alt+b');
  await page.getByText('Painting 3 sprites').waitFor();
  await pickSwatch(rig.session, INK);
  await drawStroke(rig.session, await rig.mapper(), STROKE);
  held.stroked = held.start.map(inked);
  await same(rig, held.stroked);
};

const flipsAndTurnsAsOneStepEach = async (rig: SheetRig): Promise<void> => {
  const { page } = rig.session;
  await applyTransform(rig.session, 'Flip horizontal');
  await same(rig, held.stroked.map((part) => flipGrid(part, SIDE)));
  await page.keyboard.press(SHORTCUT.undo);
  await same(rig, held.stroked);
  await selectAll(rig);
  await applyTransform(rig.session, 'Rotate 90 clockwise');
  await same(rig, held.stroked.map((part) => turnGrid(part, SIDE)));
  await page.keyboard.press(SHORTCUT.undo);
  await same(rig, held.stroked);
};

const undoesTheStrokeInOneStep = async (rig: SheetRig): Promise<void> => {
  await rig.session.page.keyboard.press(SHORTCUT.undo);
  await same(rig, held.start);
  await rig.session.page.keyboard.press(SHORTCUT.redo);
  await same(rig, held.stroked);
};

describe('check 5: a padded grid sheet, a shared stroke and batch edits', () => {
  const rig = useRig(openSheetRig);
  test('slices the padded grid into three sprites that hold only their own cell', () => slicesTheGrid(rig()));
  test('paints one shared local stroke on all three selected sprites', () => paintsOneSharedStroke(rig()));
  test('one flip and one quarter turn each change all three sprites and each undo restores all three', () => flipsAndTurnsAsOneStepEach(rig()));
  test('one undo takes the whole stroke back from all three and redo puts it back', () => undoesTheStrokeInOneStep(rig()));
});

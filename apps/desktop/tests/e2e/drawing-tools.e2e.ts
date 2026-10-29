/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { clickCells } from './support/click-cells';
import { clickCellWith } from './support/click-cell-with';
import { drawStroke } from './support/draw-stroke';
import { SHORTCUT } from './support/e2e.constants';
import { filledCells } from './support/filled-cells';
import { makeRamp } from './support/make-ramp';
import { MARKS_SIDE } from './support/marks.constants';
import { openSpriteRig } from './support/open-sprite-rig';
import { pickSwatch } from './support/pick-swatch';
import { pressToolKey } from './support/press-tool-key';
import { useRig } from './support/use-rig';

const indexAt = (grid: Uint8Array, x: number, y: number): number => grid[y * MARKS_SIDE + x] ?? 0;

const CORNERS = [{ x: 2, y: 2 }, { x: 12, y: 2 }, { x: 7, y: 12 }];

const BOX = [{ x: 3, y: 3 }, { x: 7, y: 6 }];

describe('the drawing tools, one tool per key', () => {
  const rig = useRig(openSpriteRig);

  test('the line tool draws a line and undoes it in one step', async () => {
    const { session, remap, shownNow } = rig();
    await pressToolKey(session, 'l');
    await drawStroke(session, await remap(), [{ x: 2, y: 2 }, { x: 8, y: 2 }]);
    expect(filledCells(await shownNow())).toEqual([2, 3, 4, 5, 6, 7, 8].map((x) => `${x},2`).sort());
    await session.page.keyboard.press(SHORTCUT.undo);
    expect(filledCells(await shownNow())).toEqual([]);
  });

  test('the rectangle tool draws an outline, and a second U press fills it', async () => {
    const { session, remap, shownNow } = rig();
    await pressToolKey(session, 'u');
    await drawStroke(session, await remap(), BOX);
    const outline = await shownNow();
    expect([indexAt(outline, 5, 4), indexAt(outline, 3, 3) === 0]).toEqual([0, false]);
    await session.page.keyboard.press(SHORTCUT.undo);
    await session.page.keyboard.press('u');
    await drawStroke(session, await remap(), BOX);
    expect(indexAt(await shownNow(), 5, 4)).not.toBe(0);
    await session.page.keyboard.press(SHORTCUT.undo);
  });

  test('the right button of the eraser paints the back colour over the front colour', async () => {
    const { session, remap, shownNow } = rig();
    const { page } = session;
    const map = await remap();
    await pressToolKey(session, 'b');
    await drawStroke(session, map, [{ x: 10, y: 10 }, { x: 12, y: 10 }]);
    expect(filledCells(await shownNow())).toEqual(['10,10', '11,10', '12,10']);
    await page.keyboard.press('e');
    const from = map({ x: 10, y: 12 });
    const to = map({ x: 12, y: 12 });
    await page.mouse.move(from.x, from.y);
    await page.mouse.down({ button: 'right' });
    await page.mouse.move(to.x, to.y);
    await page.mouse.up({ button: 'right' });
    expect(filledCells(await shownNow())).toEqual(['10,10', '11,10', '12,10']);
    await page.keyboard.press(SHORTCUT.undo);
    await page.keyboard.press(SHORTCUT.undo);
  });
});

describe('the spray, gradient and polygon tools', () => {
  const rig = useRig(openSpriteRig);

  test('the spray tool paints dots inside its disc and undoes in one step', async () => {
    const { session, remap, shownNow } = rig();
    const { page } = session;
    await pressToolKey(session, 'Shift+b');
    const centre = (await remap())({ x: 8, y: 8 });
    await page.mouse.move(centre.x, centre.y);
    await page.mouse.down();
    await page.waitForTimeout(300);
    await page.mouse.up();
    expect(filledCells(await shownNow()).length).toBeGreaterThan(2);
    await page.keyboard.press(SHORTCUT.undo);
    expect(filledCells(await shownNow())).toEqual([]);
  });

  test('the gradient tool falls back to the front and back colour without a ramp', async () => {
    const { session, remap, shownNow } = rig();
    await pressToolKey(session, 'Shift+g');
    await drawStroke(session, await remap(), [{ x: 0, y: 8 }, { x: 15, y: 8 }]);
    expect(filledCells(await shownNow()).length).toBeGreaterThan(MARKS_SIDE);
    await session.page.keyboard.press(SHORTCUT.undo);
    expect(filledCells(await shownNow())).toEqual([]);
  });

  test('the polygon tool closes on Enter and Escape cancels the draft', async () => {
    const { session, remap, shownNow } = rig();
    const map = await remap();
    await pressToolKey(session, 'Shift+d');
    await clickCells(session, map, CORNERS);
    await session.page.keyboard.press('Escape');
    expect(filledCells(await shownNow())).toEqual([]);
    await clickCells(session, map, CORNERS);
    await session.page.keyboard.press('Enter');
    expect(filledCells(await shownNow()).length).toBeGreaterThan(10);
    await session.page.keyboard.press(SHORTCUT.undo);
  });
});

describe('the shade tool on a ramp made in the palette panel', () => {
  const rig = useRig(openSpriteRig);

  test('moves a pixel up the ramp with the left button and down with the right, and undoes each pass', async () => {
    const { session, remap, shownNow } = rig();
    const cell = { x: 6, y: 6 };
    await makeRamp(session, [2, 3, 4]);
    await pickSwatch(session, 3);
    await pressToolKey(session, 'b');
    await clickCells(session, await remap(), [cell]);
    expect(indexAt(await shownNow(), cell.x, cell.y)).toBe(3);
    await pressToolKey(session, 's');
    await clickCellWith(session, await remap(), cell, 'left');
    expect(indexAt(await shownNow(), cell.x, cell.y)).toBe(4);
    await clickCellWith(session, await remap(), cell, 'right');
    expect(indexAt(await shownNow(), cell.x, cell.y)).toBe(3);
    await clickCellWith(session, await remap(), cell, 'right');
    expect(indexAt(await shownNow(), cell.x, cell.y)).toBe(2);
    await session.page.keyboard.press(SHORTCUT.undo);
    expect(indexAt(await shownNow(), cell.x, cell.y)).toBe(3);
  });

  test('stops at the end of the ramp and leaves a colour that is on no ramp alone', async () => {
    const { session, remap, shownNow } = rig();
    const cell = { x: 9, y: 9 };
    await pickSwatch(session, 4);
    await pressToolKey(session, 'b');
    await clickCells(session, await remap(), [cell]);
    await pressToolKey(session, 's');
    await clickCellWith(session, await remap(), cell, 'left');
    expect(indexAt(await shownNow(), cell.x, cell.y)).toBe(4);
    const loose = { x: 10, y: 9 };
    await pickSwatch(session, 7);
    await pressToolKey(session, 'b');
    await clickCells(session, await remap(), [loose]);
    await pressToolKey(session, 's');
    await clickCellWith(session, await remap(), loose, 'left');
    expect(indexAt(await shownNow(), loose.x, loose.y)).toBe(7);
  });
});

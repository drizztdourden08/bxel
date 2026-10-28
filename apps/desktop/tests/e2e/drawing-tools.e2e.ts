/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { drawStroke } from './support/draw-stroke';
import { SHORTCUT } from './support/e2e.constants';
import { MARKS_SIDE } from './support/marks.constants';
import { openSpriteRig } from './support/open-sprite-rig';
import { useRig } from './support/use-rig';

const filled = (grid: Uint8Array) =>
  [...grid].flatMap((index, at) => (index === 0 ? [] : [`${at % MARKS_SIDE},${Math.floor(at / MARKS_SIDE)}`])).sort();

const indexAt = (grid: Uint8Array, x: number, y: number): number => grid[y * MARKS_SIDE + x] ?? 0;

describe('the drawing tools, one tool per key', () => {
  const rig = useRig(openSpriteRig);

  test('the line tool draws a line and undoes it in one step', async () => {
    const { session, remap, shownNow } = rig();
    await session.page.getByRole('application', { name: 'Sprite canvas' }).focus();
    await session.page.keyboard.press('l');
    await drawStroke(session, await remap(), [{ x: 2, y: 2 }, { x: 8, y: 2 }]);
    expect(filled(await shownNow())).toEqual([2, 3, 4, 5, 6, 7, 8].map((x) => `${x},2`).sort());
    await session.page.keyboard.press(SHORTCUT.undo);
    expect(filled(await shownNow())).toEqual([]);
  });

  test('the rectangle tool draws an outline, and a second U press fills it', async () => {
    const { session, remap, shownNow } = rig();
    const { page } = session;
    await page.getByRole('application', { name: 'Sprite canvas' }).focus();
    await page.keyboard.press('u');
    await drawStroke(session, await remap(), [{ x: 3, y: 3 }, { x: 7, y: 6 }]);
    const outline = await shownNow();
    expect(indexAt(outline, 5, 4)).toBe(0);
    expect(indexAt(outline, 3, 3)).not.toBe(0);
    await page.keyboard.press(SHORTCUT.undo);
    await page.keyboard.press('u');
    await drawStroke(session, await remap(), [{ x: 3, y: 3 }, { x: 7, y: 6 }]);
    expect(indexAt(await shownNow(), 5, 4)).not.toBe(0);
    await page.keyboard.press(SHORTCUT.undo);
  });

  test('the right button of the eraser paints the back colour over the front colour', async () => {
    const { session, remap, shownNow } = rig();
    const { page } = session;
    const map = await remap();
    await page.getByRole('application', { name: 'Sprite canvas' }).focus();
    await page.keyboard.press('b');
    await drawStroke(session, map, [{ x: 10, y: 10 }, { x: 12, y: 10 }]);
    const painted = await shownNow();
    expect(filled(painted)).toEqual(['10,10', '11,10', '12,10']);
    await page.keyboard.press('e');
    const from = map({ x: 10, y: 12 });
    const to = map({ x: 12, y: 12 });
    await page.mouse.move(from.x, from.y);
    await page.mouse.down({ button: 'right' });
    await page.mouse.move(to.x, to.y);
    await page.mouse.up({ button: 'right' });
    expect(filled(await shownNow())).toEqual(['10,10', '11,10', '12,10']);
    await page.keyboard.press(SHORTCUT.undo);
    await page.keyboard.press(SHORTCUT.undo);
  });

});

describe('the spray, gradient and polygon tools', () => {
  const rig = useRig(openSpriteRig);

  test('the spray tool paints dots inside its disc and undoes in one step', async () => {
    const { session, remap, shownNow } = rig();
    const { page } = session;
    await page.getByRole('application', { name: 'Sprite canvas' }).focus();
    await page.keyboard.press('Shift+b');
    const centre = (await remap())({ x: 8, y: 8 });
    await page.mouse.move(centre.x, centre.y);
    await page.mouse.down();
    await page.waitForTimeout(300);
    await page.mouse.up();
    const sprayed = filled(await shownNow());
    expect(sprayed.length).toBeGreaterThan(2);
    await page.keyboard.press(SHORTCUT.undo);
    expect(filled(await shownNow())).toEqual([]);
  });

  test('the gradient tool needs a ramp or falls back to the front and back colour', async () => {
    const { session, remap, shownNow } = rig();
    const { page } = session;
    await page.getByRole('application', { name: 'Sprite canvas' }).focus();
    await page.keyboard.press('Shift+g');
    await drawStroke(session, await remap(), [{ x: 0, y: 8 }, { x: 15, y: 8 }]);
    expect(filled(await shownNow()).length).toBeGreaterThan(MARKS_SIDE);
    await page.keyboard.press(SHORTCUT.undo);
    expect(filled(await shownNow())).toEqual([]);
  });

  test('the polygon tool closes on Enter and Escape cancels the draft', async () => {
    const { session, remap, shownNow } = rig();
    const { page } = session;
    const map = await remap();
    await page.getByRole('application', { name: 'Sprite canvas' }).focus();
    await page.keyboard.press('Shift+d');
    for (const corner of [{ x: 2, y: 2 }, { x: 12, y: 2 }, { x: 7, y: 12 }]) {
      const at = map(corner);
      await page.mouse.click(at.x, at.y);
    }
    await page.keyboard.press('Escape');
    expect(filled(await shownNow())).toEqual([]);
    for (const corner of [{ x: 2, y: 2 }, { x: 12, y: 2 }, { x: 7, y: 12 }]) {
      const at = map(corner);
      await page.mouse.click(at.x, at.y);
    }
    await page.keyboard.press('Enter');
    expect(filled(await shownNow()).length).toBeGreaterThan(10);
    await page.keyboard.press(SHORTCUT.undo);
  });
});

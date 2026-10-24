/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { drawStroke } from './support/draw-stroke';
import { SHORTCUT } from './support/e2e.constants';
import { MARKS_SIDE } from './support/marks.constants';
import { openSpriteRig } from './support/open-sprite-rig';
import { useRig } from './support/use-rig';

const STROKE = [{ x: 3, y: 2 }, { x: 4, y: 3 }, { x: 5, y: 4 }, { x: 6, y: 5 }];

const filled = (grid: Uint8Array) => [...grid].flatMap((index, at) => (index === 0 ? [] : [`${at % MARKS_SIDE},${Math.floor(at / MARKS_SIDE)}`])).sort();

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
  });

  test.skip('the tiled view repeats the edge pixels across the boundary (pending: the View menu entries, including Tiled preview, are missing from the app menu and have no chord)', () => undefined);
});

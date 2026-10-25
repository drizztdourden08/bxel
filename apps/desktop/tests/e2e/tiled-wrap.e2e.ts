/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { chooseTiling } from './support/choose-tiling';
import { drawStroke } from './support/draw-stroke';
import { SHORTCUT } from './support/e2e.constants';
import type { Cell } from './support/e2e.type';
import { MARKS_SIDE } from './support/marks.constants';
import { openSpriteRig } from './support/open-sprite-rig';
import { useRig } from './support/use-rig';

const ROW = 8;

const OUT_AND_ACROSS: readonly Cell[] = [{ x: 13, y: ROW }, { x: 15, y: ROW }, { x: 18, y: ROW }];

const filled = (grid: Uint8Array) =>
  [...grid].flatMap((index, at) => (index === 0 ? [] : [`${at % MARKS_SIDE},${Math.floor(at / MARKS_SIDE)}`])).sort();

const cells = (xs: readonly number[]) => xs.map((x) => `${x},${ROW}`).sort();

describe('painting wraps across the edge when the tiled preview is on', () => {
  const rig = useRig(openSpriteRig);

  test('a stroke that leaves the right edge continues on the left edge and undoes in one step', async () => {
    const { session, remap, shownNow } = rig();
    await chooseTiling(session, /^Horizontal/);
    await session.page.keyboard.press('Minus');
    await session.page.keyboard.press('Minus');
    await drawStroke(session, await remap(), OUT_AND_ACROSS);
    expect(filled(await shownNow())).toEqual(cells([13, 14, 15, 0, 1, 2]));
    await session.page.keyboard.press(SHORTCUT.undo);
    expect(filled(await shownNow())).toEqual([]);
    expect(await session.page.getByRole('button', { name: 'Nothing to undo' }).count()).toBe(1);
  });

  test('the same stroke is clipped at the edge when the preview is off', async () => {
    const { session, remap, shownNow } = rig();
    await chooseTiling(session, /^Off/);
    await drawStroke(session, await remap(), OUT_AND_ACROSS);
    expect(filled(await shownNow())).toEqual(cells([13, 14, 15]));
    await session.page.keyboard.press(SHORTCUT.undo);
  });
});

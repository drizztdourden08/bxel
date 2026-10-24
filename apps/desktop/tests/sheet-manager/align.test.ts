/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { SpriteId } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { runDocument } from '../../src/sheet/run-document';
import { spritesTarget } from '../../src/sheet/sprites-target';
import { addToSheet } from '../../src/sheet-manager/add-to-sheet';
import { alignPlan } from '../../src/sheet-manager/align-plan';
import { alignSprites } from '../../src/sheet-manager/align-sprites';
import type { AlignBox } from '../../src/sheet-manager/align.type';
import { resizeSprites } from '../../src/sheet-manager/resize-sprites';
import { styleSheet } from '../../src/sheet-manager/style-sheet';
import { artwork, openFile, revision } from '../sheet/sheet-harness';
import { idsOf } from './manager-harness';

const box = (id: string, at: [number, number], size: [number, number]): AlignBox => ({ id: id as SpriteId, x: at[0], y: at[1], width: size[0], height: size[1] });

const where = (): Record<string, string> =>
  Object.fromEntries(
    (artwork().sheets[0]?.entries ?? []).map((entry) => [
      artwork().sprites.find((sprite) => sprite.id === entry.spriteId)?.name ?? '',
      `${entry.at.x},${entry.at.y}`,
    ]),
  );

const place = (name: string, x: number, y: number): void => {
  const sheet = artwork().sheets[0];
  const id = idsOf(name)[0];
  if (sheet && id) runDocument('Place', [{ name: COMMAND_NAME.sheetPlace, targets: spritesTarget([id]), options: { sheet: sheet.id, at: { x, y } } }]);
};

describe('the plan for aligning boxes', () => {
  const boxes = [box('a', [0, 0], [8, 8]), box('b', [20, 10], [4, 4]), box('c', [40, 3], [6, 6])];

  it('aligns edges and middles of the group', () => {
    expect(alignPlan(boxes, 'left').map((move) => move.at)).toEqual([{ x: 0, y: 10 }, { x: 0, y: 3 }]);
    expect(alignPlan(boxes, 'right').map((move) => move.at.x)).toEqual([38, 42]);
    expect(alignPlan(boxes, 'top').map((move) => move.at)).toEqual([{ x: 20, y: 0 }, { x: 40, y: 0 }]);
    expect(alignPlan(boxes, 'bottom').map((move) => move.at.y)).toEqual([6, 8]);
    expect(alignPlan(boxes, 'center').find((move) => move.id === 'a')?.at.x).toBe(19);
    expect(alignPlan(boxes, 'middle').find((move) => move.id === 'b')?.at.y).toBe(5);
  });

  it('spaces three or more evenly and leaves the ends where they are', () => {
    const moves = alignPlan(boxes, 'horizontal');
    expect(moves).toEqual([{ id: 'b', at: { x: 22, y: 10 } }]);
    expect(alignPlan([box('a', [0, 0], [2, 2]), box('b', [5, 0], [2, 2])], 'horizontal')).toEqual([]);
    expect(alignPlan([box('a', [0, 0], [2, 2])], 'left')).toEqual([]);
  });
});

describe('aligning sprites on a sheet', () => {
  beforeEach(() => {
    openFile(['a', 'b', 'c'], 8);
    resizeSprites(idsOf('b'), { width: 4, height: 4, anchor: 'top-left' });
    addToSheet(idsOf('a', 'b', 'c'), null);
    styleSheet(artwork().sheets[0]?.id ?? null, { layout: 'manual' });
    place('a', 0, 0);
    place('b', 20, 10);
    place('c', 40, 3);
  });

  it('moves the picked sprites in one undo step', () => {
    const before = revision();
    expect(alignSprites(artwork().sheets[0] ?? null, idsOf('a', 'b', 'c'), 'left')).toBe(true);
    expect(revision()).toBe(before + 1);
    expect(where()).toEqual({ a: '0,0', b: '0,10', c: '0,3' });
    stepHistory('undo');
    expect(where()).toEqual({ a: '0,0', b: '20,10', c: '40,3' });
  });

  it('does nothing on a sheet that is not by hand or when nothing would move', () => {
    expect(alignSprites(artwork().sheets[0] ?? null, idsOf('a', 'b', 'c'), 'top')).toBe(true);
    expect(alignSprites(artwork().sheets[0] ?? null, idsOf('a', 'b', 'c'), 'top')).toBe(false);
    styleSheet(artwork().sheets[0]?.id ?? null, { layout: 'grid', columns: 2 });
    expect(alignSprites(artwork().sheets[0] ?? null, idsOf('a', 'b', 'c'), 'left')).toBe(false);
    expect(alignSprites(null, idsOf('a'), 'left')).toBe(false);
  });
});

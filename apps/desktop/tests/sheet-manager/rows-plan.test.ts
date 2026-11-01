/* @layer renderer-app @kind test */
import type { SpriteId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import type { AlignBox } from '../../src/sheet-manager/align.type';
import { rowsPlan } from '../../src/sheet-manager/rows-plan';
import { fitLabel } from '../../src/views/SheetCanvas/behavior/fit-label';

const box = (id: string, x: number, y: number): AlignBox => ({ id: id as SpriteId, x, y, width: 10, height: 10 });

describe('K1 distribute in rows', { tags: ['critical'] }, () => {
  it('does nothing for fewer than two boxes', () => {
    expect(rowsPlan([box('a', 0, 0)], 2)).toEqual([]);
  });

  it('wraps four boxes into two rows of two from the top left corner', () => {
    const boxes = [box('a', 0, 0), box('b', 50, 0), box('c', 0, 50), box('d', 50, 50)];
    const moves = rowsPlan(boxes, 2);
    const at = Object.fromEntries(moves.map((move) => [move.id, `${move.at.x},${move.at.y}`]));
    expect(at).toEqual({ b: '12,0', c: '0,12', d: '12,12' });
  });
});

describe('K1 canvas label fit', { tags: ['critical'] }, () => {
  const measure = (text: string): number => text.length * 5;

  it('keeps a name that fits', () => {
    expect(fitLabel('slime', 40, measure)).toBe('slime');
  });

  it('shortens a name with an ellipsis', () => {
    const text = fitLabel('fx_glow_long', 40, measure);
    expect(text.endsWith('..')).toBe(true);
    expect(measure(text)).toBeLessThanOrEqual(40);
  });

  it('hides a name with no room at all', () => {
    expect(fitLabel('slime', 4, measure)).toBe('');
  });
});

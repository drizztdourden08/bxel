/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { quickMaskResult } from '../../src/editor/selection/quick-mask';
import { quickMaskFill } from '../../src/editor/selection/quick-mask-fill';
import { stampQuickMask } from '../../src/editor/selection/stamp-quick-mask';
import { stampQuickShape } from '../../src/editor/selection/stamp-quick-shape';
import { useDrawingStore } from '../../src/stores/useDrawingStore';
import { useToolStore } from '../../src/stores/useToolStore';

const SIZE = { width: 4, height: 1 };

const painted = (from: number, to: number): Uint8Array => {
  const scratch = new Uint8Array(SIZE.width * SIZE.height);
  stampQuickMask(scratch, SIZE, [{ x: from, y: 0 }, { x: to, y: 0 }], { ...useToolStore.getState(), brushSize: 1, brushShape: 'square' });
  return scratch;
};

describe('K1 quick mask painting', { tags: ['critical'] }, () => {
  it('the front tool adds the painted pixels to the selection', () => {
    const mask = quickMaskResult(null, painted(1, 2), SIZE, false);
    expect([...mask.bits]).toEqual([0, 1, 1, 0]);
  });

  it('the eraser removes the painted pixels and leaves the rest', () => {
    const base = quickMaskResult(null, painted(0, 3), SIZE, false);
    const mask = quickMaskResult(base, painted(1, 2), SIZE, true);
    expect([...mask.bits]).toEqual([1, 0, 0, 1]);
  });

  it('erasing everything leaves an empty mask of the same size', () => {
    const base = quickMaskResult(null, painted(1, 1), SIZE, false);
    const mask = quickMaskResult(base, painted(1, 1), SIZE, true);
    expect(mask.width).toBe(4);
    expect([...mask.bits]).toEqual([0, 0, 0, 0]);
  });
});

const GRID = { width: 5, height: 5 };

const settings = () => ({ ...useToolStore.getState(), brushSize: 1, brushShape: 'square' as const });

const shapeBits = (shape: 'line' | 'rect' | 'ellipse', to: { x: number; y: number }, size = GRID): number[] => {
  const scratch = new Uint8Array(size.width * size.height);
  stampQuickShape(scratch, size, shape, { from: { x: 0, y: 0 }, to }, settings());
  return [...scratch];
};

const total = (bits: readonly number[]): number => bits.reduce((sum, bit) => sum + bit, 0);

describe('K1 quick mask shapes', { tags: ['critical'] }, () => {
  it('a line paints the pixels between its ends', () => {
    expect(shapeBits('line', { x: 3, y: 0 }, SIZE)).toEqual([1, 1, 1, 1]);
  });

  it('a rectangle paints its outline, or its whole area when filled', () => {
    useDrawingStore.getState().setFilled('rect', false);
    expect(total(shapeBits('rect', { x: 2, y: 2 }))).toBe(8);
    useDrawingStore.getState().setFilled('rect', true);
    expect(total(shapeBits('rect', { x: 2, y: 2 }))).toBe(9);
    useDrawingStore.getState().setFilled('rect', false);
  });

  it('an ellipse stays inside its box and touches all four sides', () => {
    const bits = shapeBits('ellipse', { x: 4, y: 4 });
    const at = (x: number, y: number): number => bits[y * GRID.width + x] ?? 0;
    expect(at(0, 2) + at(4, 2) + at(2, 0) + at(2, 4)).toBe(4);
    expect(at(0, 0)).toBe(0);
  });
});

describe('K1 quick mask fill', { tags: ['critical'] }, () => {
  const wall = { bits: Uint8Array.from([0, 0, 1, 0, 0]), width: 5, height: 1 };
  const row = { width: 5, height: 1 };

  it('adds the empty area around the seed up to the painted wall', () => {
    const mask = quickMaskFill({ base: wall, size: row, seed: { x: 0, y: 0 }, erase: false, connectivity: 4 });
    expect([...mask.bits]).toEqual([1, 1, 1, 0, 0]);
  });

  it('removes the painted area the seed sits in', () => {
    const mask = quickMaskFill({ base: wall, size: row, seed: { x: 2, y: 0 }, erase: true, connectivity: 4 });
    expect([...mask.bits]).toEqual([0, 0, 0, 0, 0]);
  });

  it('fills the whole canvas when nothing is painted yet', () => {
    const mask = quickMaskFill({ base: null, size: row, seed: { x: 3, y: 0 }, erase: false, connectivity: 4 });
    expect([...mask.bits]).toEqual([1, 1, 1, 1, 1]);
  });
});

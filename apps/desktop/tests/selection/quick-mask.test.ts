/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { quickMaskResult } from '../../src/editor/selection/quick-mask';
import { stampQuickMask } from '../../src/editor/selection/stamp-quick-mask';
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

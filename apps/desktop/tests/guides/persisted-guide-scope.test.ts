/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { persistedGuideScope } from '../../src/guides/persisted-guide-scope';

const scope = (lines?: { x: number[]; y: number[] }) => {
  const write = vi.fn();
  return { write, scope: persistedGuideScope({ lines, size: () => ({ width: 96, height: 64 }), step: () => 8, write }) };
};

describe('guides saved with a sheet or a map', () => {
  it('write the whole new set of guides, sorted and without doubles, for an add', () => {
    const { scope: guides, write } = scope({ x: [16, 40], y: [] });
    guides.add('x', 8);
    guides.add('x', 16);
    expect(write).toHaveBeenNthCalledWith(1, 'Add guide', { x: [8, 16, 40], y: [] });
    expect(write).toHaveBeenNthCalledWith(2, 'Add guide', { x: [16, 40], y: [] });
  });

  it('write a move and a remove on one axis and keep the other axis', () => {
    const { scope: guides, write } = scope({ x: [16], y: [8, 24] });
    guides.move('y', 8, 32);
    guides.remove('x', 16);
    expect(write).toHaveBeenNthCalledWith(1, 'Move guide', { x: [16], y: [24, 32] });
    expect(write).toHaveBeenNthCalledWith(2, 'Remove guide', { x: [], y: [8, 24] });
  });

  it('write an empty set to clear, and start from nothing when the asset has no guides', () => {
    const { scope: guides, write } = scope();
    guides.add('y', 4);
    guides.clear();
    expect(write).toHaveBeenNthCalledWith(1, 'Add guide', { x: [], y: [4] });
    expect(write).toHaveBeenNthCalledWith(2, 'Clear guides', { x: [], y: [] });
    expect(guides.lines()).toBeUndefined();
    expect(guides.step('x')).toBe(8);
  });
});

/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { onionGhostOf } from '../../src/timeline/onion-ghost-of';
import { patternKeeps } from '../../src/timeline/pattern-keeps';

const row = (pattern: Parameters<typeof patternKeeps>[0], side: 'before' | 'after', y: number): boolean[] =>
  [0, 1, 2, 3].map((x) => patternKeeps(pattern, side, { x, y }));

describe('K1 onion pattern cue', { tags: ['critical'] }, () => {
  it('keeps every pixel when no pattern is chosen', () => {
    expect(row('none', 'before', 0)).toEqual([true, true, true, true]);
    expect(row(undefined, 'after', 1)).toEqual([true, true, true, true]);
  });

  it('draws dots as a checker and lines as every second row', () => {
    expect(row('dots', 'before', 0)).toEqual([true, false, true, false]);
    expect(row('dots', 'after', 1)).toEqual([false, true, false, true]);
    expect(row('lines', 'before', 0)).toEqual([true, true, true, true]);
    expect(row('lines', 'before', 1)).toEqual([false, false, false, false]);
  });

  it('gives the ghosts before the frame dots and the ghosts after it lines in the split pattern', () => {
    expect(row('split', 'before', 1)).toEqual(row('dots', 'before', 1));
    expect(row('split', 'after', 1)).toEqual(row('lines', 'after', 1));
  });

  it('carries the pattern into the ghost and defaults to none', () => {
    const onion = { tint: 'split', beforeColour: '#e04848', afterColour: '#4880e8', style: 'filled', position: 'behind' } as Parameters<typeof onionGhostOf>[1];
    const layer = { frameId: 'f' as never, flip: null, side: 'before' as const, alpha: 0.4 };
    expect(onionGhostOf(layer, onion).pattern).toBe('none');
    expect(onionGhostOf(layer, onion, 'dots').pattern).toBe('dots');
  });
});

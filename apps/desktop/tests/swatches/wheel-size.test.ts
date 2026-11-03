/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { wheelSize } from '../../src/views/PalettePanel/behavior/wheel-size';

describe('swatch wheel size', { tags: ['critical'] }, () => {
  it('steps one size larger or smaller', () => {
    expect(wheelSize(16, 1)).toBe(24);
    expect(wheelSize(32, -1)).toBe(24);
  });

  it('stops at the smallest and the largest size', () => {
    expect(wheelSize(16, -1)).toBe(16);
    expect(wheelSize(32, 1)).toBe(32);
  });
});

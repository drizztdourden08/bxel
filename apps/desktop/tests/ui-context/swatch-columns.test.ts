/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { swatchColumns } from '../../src/views/PaletteCard/behavior/swatch-columns';

describe('the palette card swatch columns', () => {
  it('fills every row evenly for the usual palette sizes', () => {
    for (const count of [4, 8, 12, 15, 16, 24, 32, 64, 256]) expect(count % swatchColumns(count)).toBe(0);
  });

  it('wraps 16 swatches in two rows of 8', () => {
    expect(swatchColumns(16)).toBe(8);
  });

  it('keeps a ragged last row only when no even split exists', () => {
    expect(swatchColumns(13)).toBe(8);
    expect(swatchColumns(3)).toBe(3);
  });
});

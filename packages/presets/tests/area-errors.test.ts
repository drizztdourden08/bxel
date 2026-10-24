/* @layer tests @kind test */
import { checkAreas } from '@bxel/presets';
import { describe, expect, it } from 'vitest';
import { preset, runs, size } from './preset-fixtures';

const NES_BANK = { cap: 16 };

describe('checkAreas refusals', () => {
  it('refuses a buffer of the wrong length', () => {
    const result = checkAreas(preset('nes-bg'), new Uint8Array(10), size(8, 8), NES_BANK);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('BUFFER_MISMATCH');
  });

  it('refuses an index outside the bank', () => {
    const buffer = runs(8, [[0, 2], [99, 1], [0, 5]]);
    const result = checkAreas(preset('nes-bg'), buffer, size(8, 8), NES_BANK);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('INDEX_INVALID');
      expect(result.issues).toEqual(['2']);
    }
  });

  it('refuses a size that is not whole numbers above zero', () => {
    const result = checkAreas(preset('nes-bg'), new Uint8Array(0), size(0, 0), NES_BANK);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('SIZE_INVALID');
  });
});

/* @layer tests @kind test */
import { checkSprite } from '@bxel/presets';
import { describe, expect, it } from 'vitest';
import { preset, size } from './preset-fixtures';

describe('checkSprite', () => {
  it('accepts every size in a list and refuses the rest', () => {
    const gba = preset('gba-4bpp');
    expect(checkSprite(gba, size(64, 32)).ok).toBe(true);
    expect(checkSprite(gba, size(32, 64)).ok).toBe(true);
    const refused = checkSprite(gba, size(24, 24));
    expect(refused.ok).toBe(false);
    if (!refused.ok) {
      expect(refused.code).toBe('SIZE_NOT_ALLOWED');
      expect(refused.issues).toContain('64x64');
    }
  });

  it('accepts a size that belongs to any SNES size pair', () => {
    const snes = preset('snes-sprite');
    expect(checkSprite(snes, size(8, 8)).ok).toBe(true);
    expect(checkSprite(snes, size(64, 64)).ok).toBe(true);
    expect(checkSprite(snes, size(16, 32)).ok).toBe(false);
  });

  it('accepts the two NES sprite modes only', () => {
    const nes = preset('nes-sprite');
    expect(checkSprite(nes, size(8, 8)).ok).toBe(true);
    expect(checkSprite(nes, size(8, 16)).ok).toBe(true);
    expect(checkSprite(nes, size(16, 16)).ok).toBe(false);
  });

  it('checks steps with a maximum', () => {
    const genesis = preset('genesis');
    expect(checkSprite(genesis, size(24, 32)).ok).toBe(true);
    expect(checkSprite(genesis, size(40, 8)).ok).toBe(false);
    expect(checkSprite(genesis, size(12, 8)).ok).toBe(false);
  });

  it('accepts any size on a generic preset', () => {
    expect(checkSprite(preset('generic-16'), size(37, 5)).ok).toBe(true);
  });

  it('refuses sizes that are not whole numbers above zero', () => {
    for (const bad of [size(0, 8), size(8, -8), size(8.5, 8), size(Number.NaN, 8)]) {
      const result = checkSprite(preset('generic-16'), bad);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.code).toBe('SIZE_INVALID');
    }
  });
});

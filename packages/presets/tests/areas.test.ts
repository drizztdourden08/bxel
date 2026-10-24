/* @layer tests @kind test */
import { checkAreas } from '@bxel/presets';
import { describe, expect, it } from 'vitest';
import { preset, runs, size } from './preset-fixtures';

const NES_BANK = { cap: 16 };

describe('checkAreas on the NES background', () => {
  it('reports a 16x16 area that uses two palettes', () => {
    const buffer = runs(16, [[1, 8], [5, 8], [9, 16]]);
    const result = checkAreas(preset('nes-bg'), buffer, size(32, 16), NES_BANK);
    expect(result).toEqual({
      ok: true,
      value: [
        {
          code: 'AREA_PALETTE_CLASH',
          x: 0,
          y: 0,
          width: 16,
          height: 16,
          used: 2,
          limit: 1,
          tier: 'warn',
        },
      ],
    });
  });

  it('passes a clean background', () => {
    const buffer = runs(16, [[1, 8], [0, 8], [10, 16]]);
    const result = checkAreas(preset('nes-bg'), buffer, size(32, 16), NES_BANK);
    expect(result).toEqual({ ok: true, value: [] });
  });

  it('treats the shared backdrop slot of every bank as no palette', () => {
    const buffer = runs(16, [[0, 8], [4, 4], [13, 4]]);
    const result = checkAreas(preset('nes-bg'), buffer, size(16, 16), NES_BANK);
    expect(result).toEqual({ ok: true, value: [] });
  });

  it('clips the last areas of an image that is not a multiple of the area', () => {
    const buffer = runs(4, [[0, 17], [1, 1], [0, 1], [5, 1]]);
    const result = checkAreas(preset('nes-bg'), buffer, size(20, 4), NES_BANK);
    expect(result).toEqual({
      ok: true,
      value: [
        {
          code: 'AREA_PALETTE_CLASH',
          x: 16,
          y: 0,
          width: 4,
          height: 4,
          used: 2,
          limit: 1,
          tier: 'warn',
        },
      ],
    });
  });
});

describe('checkAreas on other presets', () => {
  it('checks the 8x8 tiles of a tile based console', () => {
    const buffer = runs(8, [[0, 3], [17, 1], [1, 1], [0, 11]]);
    const result = checkAreas(preset('gba-4bpp'), buffer, size(16, 8), { cap: 256 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toHaveLength(1);
      expect(result.value[0]).toMatchObject({ x: 0, y: 0, width: 8, height: 8, used: 2 });
    }
  });

  it('reports a colour limit rule', () => {
    const limited = {
      ...preset('generic-16'),
      areaRules: [
        {
          width: 4,
          height: 4,
          scope: 'any',
          kind: 'maxColoursPerArea',
          limit: 2,
          tier: 'warn',
        },
      ],
    } as const;
    const buffer = runs(4, [[0, 1], [1, 1], [2, 1], [3, 1]]);
    const result = checkAreas(limited, buffer, size(4, 4), { cap: 16 });
    expect(result.ok && result.value[0]?.code).toBe('AREA_COLOUR_LIMIT');
    expect(result.ok && result.value[0]?.used).toBe(4);
  });

  it('returns nothing for a preset without area rules', () => {
    const buffer = runs(8, [[0, 4], [3, 4]]);
    const result = checkAreas(preset('snes-sprite'), buffer, size(8, 8), { cap: 16 });
    expect(result).toEqual({ ok: true, value: [] });
  });
});

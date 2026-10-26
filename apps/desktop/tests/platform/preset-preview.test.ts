/* @layer renderer-app @kind test */
import { findPreset, listPresets } from '@bxel/presets';
import type { PlatformPreset } from '@bxel/presets';
import { describe, expect, it } from 'vitest';
import { presetFacts } from '../../src/platform-preset/preset-facts';
import { presetPalette } from '../../src/platform-preset/preset-palette';
import { previewSizes } from '../../src/platform-preset/preview-sizes';
import { sampleColour } from '../../src/platform-preset/sample-colour';
import { samplePalette } from '../../src/platform-preset/sample-palette';

const presetOf = (id: string): PlatformPreset => {
  const found = findPreset(id);
  if (!found.ok) throw new Error(`no preset ${id}`);
  return found.value;
};

const valueOf = (preset: PlatformPreset, label: string): string | undefined =>
  presetFacts(preset).flat().find((fact) => fact.label === label)?.value;

const byAmount = (a: number, b: number): number => a - b;

const areasOf = (preset: PlatformPreset): number[] => previewSizes(preset).map((size) => size[0] * size[1]);

const ALL = listPresets().flatMap((family) => [...family.presets]);

describe('preset facts', () => {
  it('states the colour count, the palettes and the tile size of a preset', () => {
    const nes = presetOf('nes-sprite');
    expect(valueOf(nes, 'Colours')).toBe('55 fixed colours');
    expect(valueOf(nes, 'Palettes')).toBe('4 palettes of 4 slots');
    expect(valueOf(nes, 'Tile size')).toBe('8 by 8');
  });

  it('lists the area rules only for a preset that has them', () => {
    expect(valueOf(presetOf('nes-sprite'), 'Area rules')).toBeUndefined();
    expect(valueOf(presetOf('nes-bg'), 'Area rules')).toBe('16 by 16 area: one palette per area (warning)');
  });

  it('describes every preset in the catalog', () => {
    ALL.forEach((preset) => expect(presetFacts(preset).flat().length).toBeGreaterThanOrEqual(7));
  });
});

describe('preset preview', () => {
  it('takes the palette of a fixed set and none for a free colour model', () => {
    expect(presetPalette(presetOf('nes-sprite'))).toHaveLength(55);
    ALL.forEach((preset) => expect(Array.isArray(presetPalette(preset))).toBe(true));
  });

  it('shows the new sprite size and at most six sizes, smallest first', () => {
    ALL.forEach((preset) => {
      const areas = areasOf(preset);
      expect(areas.length).toBeGreaterThan(0);
      expect(areas.length).toBeLessThanOrEqual(6);
      expect(areas).toEqual([...areas].sort(byAmount));
    });
  });

  it('keeps the sample colours to a few, spread across the palette', () => {
    expect(samplePalette(presetPalette(presetOf('nes-sprite')))).toHaveLength(5);
    expect(samplePalette([])).toHaveLength(4);
  });

  it('draws a diamond: transparent in the corner, coloured in the middle', () => {
    const colours = ['#111111', '#222222', '#333333'];
    expect(sampleColour(0, 0, [8, 8], colours)).toBeNull();
    expect(sampleColour(4, 4, [8, 8], colours)).toBe('#111111');
  });
});

/* @layer tests @kind test */
import { findPreset, listPresets, presetDefaults } from '@bxel/presets';
import type { PlatformPreset } from '@bxel/presets';
import { describe, expect, it } from 'vitest';

const allPresets = (): PlatformPreset[] => listPresets().flatMap((group) => [...group.presets]);

describe('catalog', () => {
  it('gives every preset a full palette of snapped, distinct colours', () => {
    for (const preset of allPresets()) {
      const defaults = presetDefaults(preset);
      expect(defaults.palette).toHaveLength(preset.banks.size);
      const rgbs = defaults.palette.flatMap((slot) => (slot.kind === 'color' ? [slot.rgb] : []));
      expect(new Set(rgbs).size).toBe(rgbs.length);
      for (const rgb of rgbs) expect(rgb).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it('keeps every preset consistent', () => {
    const presets = allPresets();
    const ids = presets.map((preset) => preset.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const preset of presets) {
      expect(preset.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(preset.banks.size).toBeGreaterThanOrEqual(2);
      expect(preset.banks.size).toBeLessThanOrEqual(256);
      expect(preset.notes.length).toBeGreaterThan(0);
    }
  });

  it('groups the presets by family in catalog order', () => {
    const groups = listPresets();
    expect(groups.map((group) => group.family)).toEqual([
      'Generic',
      'NES',
      'Game Boy',
      'Game Boy Advance',
      'SNES',
      'Master System',
      'Genesis',
      'PICO-8',
      'TIC-80',
    ]);
    expect(allPresets()).toHaveLength(20);
    expect(groups.find((group) => group.family === 'SNES')?.presets).toHaveLength(4);
  });

  it('reports an unknown id with a code', () => {
    const result = findPreset('amiga');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('PRESET_UNKNOWN');
  });
});

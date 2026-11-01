/* @layer tests @kind test */
import { presetDefaults } from '@bxel/presets';
import type { PresetDefaults } from '@bxel/presets';
import { describe, expect, it } from 'vitest';
import { preset } from './preset-fixtures';

const defaultsOf = (id: string): PresetDefaults => presetDefaults(preset(id));

describe('K1 presetDefaults', { tags: ['critical'] }, () => {
  it('sets the SNES sprite structure', () => {
    const defaults = defaultsOf('snes-sprite');
    expect(defaults.bankCount).toBe(8);
    expect(defaults.bankSize).toBe(16);
    expect(defaults.transparent).toBe(true);
    expect(defaults.spriteSize).toEqual({ width: 16, height: 16 });
    expect(defaults.tileSize).toEqual({ width: 8, height: 8 });
    expect(defaults.palette).toHaveLength(16);
    expect(defaults.palette[0]).toEqual({ kind: 'transparent' });
  });

  it('sets the NES background with one shared backdrop slot', () => {
    const defaults = defaultsOf('nes-bg');
    expect(defaults.bankCount).toBe(4);
    expect(defaults.bankSize).toBe(4);
    expect(defaults.slot0).toBe('background');
    expect(defaults.slot0Shared).toBe(true);
    expect(defaults.transparent).toBe(false);
    expect(defaults.palette[0]).toEqual({ kind: 'color', rgb: '#000000' });
  });

  it('sets the generic presets as a flat transparent bank', () => {
    const defaults = defaultsOf('generic-256');
    expect(defaults.bankCount).toBe(1);
    expect(defaults.bankSize).toBe(256);
    expect(defaults.palette).toHaveLength(256);
    expect(defaults.spriteSize).toEqual({ width: 32, height: 32 });
    expect(defaults.tileSize).toBeNull();
  });
});

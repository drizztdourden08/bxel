/* @layer tests @kind test */
import { checkPlatform, presetDefaults } from '@bxel/presets';
import type { BankFacts } from '@bxel/presets';
import { describe, expect, it } from 'vitest';
import { preset, size } from './preset-fixtures';

const startBank = (id: string): BankFacts => {
  const defaults = presetDefaults(preset(id));
  return {
    name: 'Main',
    cap: defaults.bankSize,
    transparent: defaults.transparent,
    colours: defaults.palette.flatMap((slot) => (slot.kind === 'color' ? [slot.rgb] : [])),
  };
};

describe('checkPlatform', () => {
  it('finds nothing wrong in the start state of each preset', () => {
    for (const id of ['snes-sprite', 'nes-sprite', 'gb-dmg', 'pico-8', 'generic-16']) {
      const defaults = presetDefaults(preset(id));
      expect(checkPlatform(preset(id), { banks: [startBank(id)], sprites: [defaults.spriteSize] })).toEqual([]);
    }
  });

  it('flags a bank of the wrong size at the tier of the preset', () => {
    const findings = checkPlatform(preset('snes-sprite'), { banks: [{ ...startBank('snes-sprite'), cap: 32 }], sprites: [] });
    expect(findings).toEqual([
      { rule: 'bankSize', tier: 'enforce', message: 'Main holds 32 slots. SNES sprite 4bpp uses 16.' },
    ]);
  });

  it('flags a missing transparent slot 0', () => {
    const findings = checkPlatform(preset('snes-sprite'), { banks: [{ ...startBank('snes-sprite'), transparent: false }], sprites: [] });
    expect(findings.map((finding) => finding.rule)).toEqual(['slot0']);
  });

  it('counts colours off the platform grid', () => {
    const bank = { ...startBank('snes-sprite'), colours: ['#ff0000', '#010203', '#102030'] };
    const findings = checkPlatform(preset('snes-sprite'), { banks: [bank], sprites: [] });
    expect(findings).toHaveLength(1);
    expect(findings[0]?.rule).toBe('colour');
    expect(findings[0]?.message).toContain('colours are not on the SNES sprite 4bpp colour grid');
  });

  it('flags more palettes than the platform has, and sprite sizes it cannot draw once each', () => {
    const banks = Array.from({ length: 9 }, () => startBank('snes-sprite'));
    const sprites = [size(10, 10), size(10, 10), size(16, 16)];
    const findings = checkPlatform(preset('snes-sprite'), { banks, sprites });
    expect(findings.filter((finding) => finding.rule === 'bankCount')).toHaveLength(1);
    const sizes = findings.filter((finding) => finding.rule === 'spriteSize');
    expect(sizes).toHaveLength(1);
    expect(sizes[0]?.message).toContain('10x10');
  });

  it('skips a bad hex and does not fail', () => {
    const bank = { ...startBank('snes-sprite'), colours: ['not-a-colour'] };
    expect(checkPlatform(preset('snes-sprite'), { banks: [bank], sprites: [] })).toEqual([]);
  });
});

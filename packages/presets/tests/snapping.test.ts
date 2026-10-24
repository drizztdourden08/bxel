/* @layer tests @kind test */
import { snapColor, snapPalette } from '@bxel/presets';
import type { PlatformPreset } from '@bxel/presets';
import { describe, expect, it } from 'vitest';
import { preset } from './preset-fixtures';

const snapped = (id: string, hex: string): string => {
  const result = snapColor(preset(id), hex);
  if (!result.ok) throw new Error(result.message);
  return result.value;
};

describe('snapping per colour model', () => {
  it('snaps SNES 15 bit colours to 32 levels per channel', () => {
    expect(snapped('snes-sprite', '#000000')).toBe('#000000');
    expect(snapped('snes-sprite', '#ffffff')).toBe('#ffffff');
    expect(snapped('snes-sprite', '#0c0c0c')).toBe('#080808');
    expect(snapped('snes-sprite', '#0d0d0d')).toBe('#101010');
    expect(snapped('snes-sprite', '#123456')).toBe('#103152');
  });

  it('snaps Genesis 9 bit colours to the 8 linear levels', () => {
    expect(snapped('genesis', '#808080')).toBe('#929292');
    expect(snapped('genesis', '#fe0102')).toBe('#ff0000');
    expect(snapped('genesis', '#2a5b9c')).toBe('#244992');
  });

  it('snaps Master System colours to 2 bits per channel', () => {
    expect(snapped('sms', '#7f7f7f')).toBe('#555555');
    expect(snapped('sms', '#f0a0e0')).toBe('#ffaaff');
  });

  it('leaves 24 bit presets untouched', () => {
    expect(snapped('tic-80', '#123456')).toBe('#123456');
    expect(snapped('generic-16', '#abcdef')).toBe('#abcdef');
  });

  it('snaps to the nearest member of the fixed NES set', () => {
    const nes = preset('nes-sprite');
    expect(snapped('nes-sprite', '#000001')).toBe('#000000');
    expect(snapped('nes-sprite', '#fc0000')).toBe('#f83800');
    const colours = nes.colour.kind === 'fixedSet' ? nes.colour.colours : [];
    expect(colours).toContain(snapped('nes-bg', '#336699'));
  });

  it('snaps to the nearest PICO-8 colour and keeps exact members', () => {
    expect(snapped('pico-8', '#ff0000')).toBe('#ff004d');
    expect(snapped('pico-8', '#fff1e8')).toBe('#fff1e8');
    expect(snapped('pico-8', '#FFF1E8')).toBe('#fff1e8');
  });

  it('is idempotent for every colour model', () => {
    const samples = ['#123456', '#fedcba', '#808080', '#00ff7f'];
    for (const id of ['snes-sprite', 'genesis', 'sms', 'nes-sprite', 'pico-8', 'gb-dmg']) {
      for (const hex of samples) {
        const once = snapped(id, hex);
        expect(snapped(id, once)).toBe(once);
      }
    }
  });

  it('snaps the bits plus subset model by its bits', () => {
    const base = preset('sms');
    const ega: PlatformPreset = { ...base, colour: { kind: 'subset', bits: [2, 2, 2], subset: 16 } };
    const result = snapColor(ega, '#ab0000');
    expect(result).toEqual({ ok: true, value: '#aa0000' });
  });

  it('reports invalid colours with a code and never throws', () => {
    const result = snapColor(preset('snes-sprite'), 'red');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('COLOUR_INVALID');
  });
});

describe('snapPalette', () => {
  it('snaps every colour and counts the ones that moved', () => {
    const result = snapPalette(preset('sms'), ['#000000', '#7f7f7f', '#ffffff', '#ab0000']);
    expect(result).toEqual({
      ok: true,
      value: { colours: ['#000000', '#555555', '#ffffff', '#aa0000'], moved: 2 },
    });
  });

  it('lists the invalid colours', () => {
    const result = snapPalette(preset('sms'), ['#000000', 'nope']);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('COLOUR_INVALID');
      expect(result.issues).toEqual(['nope']);
    }
  });
});

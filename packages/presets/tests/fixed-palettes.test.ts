/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { preset } from './preset-fixtures';

const colourSet = (id: string): readonly string[] => {
  const { colour } = preset(id);
  if (colour.kind !== 'fixedSet') throw new Error(`No fixed set for ${id}`);
  return colour.colours;
};

const startPalette = (id: string): readonly string[] => {
  const { startPalette: start } = preset(id);
  if (start === null) throw new Error(`No start palette for ${id}`);
  return start;
};

const HEX = /^#[0-9a-f]{6}$/;

describe('fixed palettes', () => {
  it('holds the documented count of valid colours', () => {
    expect(colourSet('nes-sprite')).toHaveLength(55);
    expect(colourSet('nes-bg')).toHaveLength(55);
    expect(colourSet('pico-8')).toHaveLength(16);
    expect(colourSet('gb-dmg')).toHaveLength(4);
    expect(startPalette('tic-80')).toHaveLength(16);
  });

  it('uses valid, lower case hex and no repeats', () => {
    const sets = [
      colourSet('nes-sprite'),
      colourSet('pico-8'),
      colourSet('gb-dmg'),
      startPalette('tic-80'),
    ];
    for (const colours of sets) {
      for (const colour of colours) expect(colour).toMatch(HEX);
      expect(new Set(colours).size).toBe(colours.length);
    }
  });

  it('keeps the NES set shared between the sprite and the background preset', () => {
    expect(colourSet('nes-sprite')).toBe(colourSet('nes-bg'));
  });
});

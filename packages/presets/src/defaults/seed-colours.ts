/* @layer core @kind logic */
import { parseHex } from '@bxel/palette';
import type { PlatformPreset } from '../model/preset.type';
import { rampColours } from './ramp-colours';

const toRgb = (hex: string): number => parseHex(hex) ?? 0;

const seedColours = (preset: PlatformPreset, count: number): number[] => {
  if (preset.startPalette !== null) return preset.startPalette.slice(0, count).map(toRgb);
  if (preset.colour.kind === 'fixedSet' && preset.colour.colours.length <= count) {
    return preset.colour.colours.map(toRgb);
  }
  return rampColours(count);
};

export { seedColours };

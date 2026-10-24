/* @layer core @kind logic */
import { formatHex } from '@bxel/palette';
import type { PlatformPreset } from '../model/preset.type';
import { makeSnapper } from '../snap/make-snapper';
import { seedColours } from './seed-colours';
import { spreadColours } from './spread-colours';

const startColours = (preset: PlatformPreset, count: number): string[] => {
  const snap = makeSnapper(preset.colour);
  const seeded = [...new Set(seedColours(preset, count).map(snap))];
  const extra =
    preset.colour.kind === 'fixedSet'
      ? []
      : spreadColours(preset.colour.bits, count - seeded.length, new Set(seeded));
  const filled = [...seeded, ...extra];
  const last = filled.at(-1) ?? 0;
  return Array.from({ length: count }, (_unused, index) => formatHex(filled[index] ?? last));
};

export { startColours };

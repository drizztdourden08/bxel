/* @layer core @kind logic */
import type { PlatformPreset } from '../model/preset.type';
import { COLOUR_888 } from './colour-models.constants';
import { SIZES_ANY } from './sprite-sizes.constants';
import { TIERS_FREE } from './rule-tiers.constants';

const makeGenericPreset = (id: string, size: number): PlatformPreset => ({
  id,
  name: `Generic ${String(size)} colours`,
  family: 'Generic',
  version: 1,
  kind: 'any',
  banks: { count: 1, size, slot0: 'transparent', slot0Forced: false, slot0Shared: false },
  colour: COLOUR_888,
  startPalette: null,
  sizes: { tile: null, sprites: SIZES_ANY, canvasDefault: [32, 32] },
  areaRules: [],
  tiers: TIERS_FREE,
  notes: [
    `A flat palette of ${String(size)} slots in 24 bit colour with no platform limits.`,
    'Slot 0 is transparent by default and can be changed.',
  ],
  advisory: [],
});

export { makeGenericPreset };

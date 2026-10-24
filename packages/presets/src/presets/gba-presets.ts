/* @layer core @kind data */
import type { PlatformPreset } from '../model/preset.type';
import { COLOUR_555 } from './colour-models.constants';
import { AREA_TILE_8 } from './area-rules.constants';
import { TIERS_STRICT } from './rule-tiers.constants';
import { SIZES_GBA } from './sprite-sizes.constants';

const GBA_PRESETS: readonly PlatformPreset[] = [
  {
    id: 'gba-4bpp',
    name: 'Game Boy Advance 4bpp',
    family: 'Game Boy Advance',
    version: 1,
    kind: 'any',
    banks: { count: 16, size: 16, slot0: 'transparent', slot0Forced: true, slot0Shared: false },
    colour: COLOUR_555,
    startPalette: null,
    sizes: { tile: [8, 8], sprites: SIZES_GBA, canvasDefault: [16, 16] },
    areaRules: [AREA_TILE_8],
    tiers: TIERS_STRICT,
    notes: [
      'Sixteen banks of 16 colours in 15 bit BGR. Index 0 of each bank is transparent.',
      'Backgrounds and sprites each have their own 256 entry palette. A tile or sprite picks one bank.',
      'Sprite shapes and sizes: Tonc, object chapter (gbadev.net/tonc/regobj.html).',
      'Palette layout: Tonc, video chapter (gbadev.net/tonc/video.html).',
    ],
    advisory: ['The hardware draws 128 sprites in total.'],
  },
  {
    id: 'gba-8bpp',
    name: 'Game Boy Advance 8bpp',
    family: 'Game Boy Advance',
    version: 1,
    kind: 'any',
    banks: { count: 1, size: 256, slot0: 'transparent', slot0Forced: true, slot0Shared: false },
    colour: COLOUR_555,
    startPalette: null,
    sizes: { tile: [8, 8], sprites: SIZES_GBA, canvasDefault: [16, 16] },
    areaRules: [],
    tiers: TIERS_STRICT,
    notes: [
      'One bank of 256 colours in 15 bit BGR. Index 0 is transparent.',
      'Sprites in 8bpp use the single 256 colour sprite palette.',
      'Palette layout: Tonc, video chapter (gbadev.net/tonc/video.html).',
    ],
    advisory: [],
  },
];

export { GBA_PRESETS };

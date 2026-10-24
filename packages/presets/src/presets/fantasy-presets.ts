/* @layer core @kind data */
import { PICO_8_COLOURS } from '../colours/pico-8-colours';
import { SWEETIE_16_COLOURS } from '../colours/sweetie-16-colours';
import type { PlatformPreset } from '../model/preset.type';
import { COLOUR_888 } from './colour-models.constants';
import { TIERS_OPEN_SLOT0 } from './rule-tiers.constants';
import { SIZES_PICO_8, SIZES_TIC_80 } from './sprite-sizes.constants';

const FANTASY_PRESETS: readonly PlatformPreset[] = [
  {
    id: 'pico-8',
    name: 'PICO-8',
    family: 'PICO-8',
    version: 1,
    kind: 'any',
    banks: { count: 1, size: 16, slot0: 'colour', slot0Forced: false, slot0Shared: false },
    colour: { kind: 'fixedSet', colours: PICO_8_COLOURS },
    startPalette: null,
    sizes: { tile: [8, 8], sprites: SIZES_PICO_8, canvasDefault: [8, 8] },
    areaRules: [],
    tiers: TIERS_OPEN_SLOT0,
    notes: [
      'The fixed 16 colour palette. Sprites are multiples of 8 pixels on a 128x128 screen.',
      'Colour 0 is black. Code can treat it as transparent, so set slot 0 to transparent for a sprite sheet.',
      'The 16 secret extended colours are not offered.',
      'Colours: Lospec PICO-8 palette (lospec.com/palette-list/pico-8).',
    ],
    advisory: [],
  },
  {
    id: 'tic-80',
    name: 'TIC-80',
    family: 'TIC-80',
    version: 1,
    kind: 'any',
    banks: { count: 1, size: 16, slot0: 'colour', slot0Forced: false, slot0Shared: false },
    colour: COLOUR_888,
    startPalette: SWEETIE_16_COLOURS,
    sizes: { tile: [8, 8], sprites: SIZES_TIC_80, canvasDefault: [8, 8] },
    areaRules: [],
    tiers: TIERS_OPEN_SLOT0,
    notes: [
      'Sixteen slots of 24 bit colour on a 240x136 screen. Sprites and tiles are multiples of 8 pixels.',
      'The colour key for transparency is chosen in code and is colour 0 by default.',
      'Starting palette: Sweetie 16 by GrafxKid (lospec.com/palette-list/sweetie-16). It is a default and not a rule.',
      'Rules: TIC-80 wiki.',
    ],
    advisory: ['The cartridge holds 256 background tiles and 256 sprites.'],
  },
];

export { FANTASY_PRESETS };

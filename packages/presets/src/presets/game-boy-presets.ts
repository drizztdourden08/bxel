/* @layer core @kind data */
import { GAME_BOY_SHADES } from '../colours/game-boy-shades';
import type { PlatformPreset } from '../model/preset.type';
import { COLOUR_555 } from './colour-models.constants';
import { AREA_TILE_8 } from './area-rules.constants';
import { TIERS_OPEN_SLOT0, TIERS_STRICT } from './rule-tiers.constants';
import { SIZE_SPEC_TILE_SET } from './size-specs.constants';
import { SIZES_8_OR_8X16 } from './sprite-sizes.constants';

const GAME_BOY_PRESETS: readonly PlatformPreset[] = [
  {
    id: 'gb-dmg',
    name: 'Game Boy',
    family: 'Game Boy',
    version: 1,
    kind: 'any',
    banks: { count: 1, size: 4, slot0: 'colour', slot0Forced: false, slot0Shared: false },
    colour: { kind: 'fixedSet', colours: GAME_BOY_SHADES },
    startPalette: null,
    sizes: SIZE_SPEC_TILE_SET,
    areaRules: [],
    tiers: TIERS_OPEN_SLOT0,
    notes: [
      'Four shades only, light to dark. The shades are a mapping, not free colours.',
      'The background uses all four shades. Sprites treat shade 0 as transparent, so set slot 0 to transparent for a sprite sheet.',
      'Shades: Lospec Nintendo Gameboy palette, classic green.',
      'Rules: Pan Docs, palettes (gbdev.io/pandocs/Palettes.html).',
    ],
    advisory: [
      'Sprites are 8x8 or 8x16 for the whole project, with two sprite palettes (OBP0, OBP1).',
      'The hardware draws 10 sprites per scanline and 40 in total.',
    ],
  },
  {
    id: 'gbc-sprite',
    name: 'Game Boy Color sprite',
    family: 'Game Boy',
    version: 1,
    kind: 'sprite',
    banks: { count: 8, size: 4, slot0: 'transparent', slot0Forced: true, slot0Shared: false },
    colour: COLOUR_555,
    startPalette: null,
    sizes: { tile: [8, 8], sprites: SIZES_8_OR_8X16, canvasDefault: [8, 8] },
    areaRules: [],
    tiers: TIERS_STRICT,
    notes: [
      'Eight sprite palettes of four colours in RGB555. Colour 0 of each palette is never drawn.',
      'Each sprite picks one palette. The sprite mode (8x8 or 8x16) is one choice for the whole project.',
      'Rules: Pan Docs, palettes (gbdev.io/pandocs/Palettes.html).',
    ],
    advisory: ['The hardware draws 10 sprites per scanline and 40 in total.'],
  },
  {
    id: 'gbc-bg',
    name: 'Game Boy Color background',
    family: 'Game Boy',
    version: 1,
    kind: 'tile',
    banks: { count: 8, size: 4, slot0: 'colour', slot0Forced: true, slot0Shared: false },
    colour: COLOUR_555,
    startPalette: null,
    sizes: SIZE_SPEC_TILE_SET,
    areaRules: [AREA_TILE_8],
    tiers: TIERS_STRICT,
    notes: [
      'Eight background palettes of four colours in RGB555, 32 colours in total. Slot 0 is an opaque colour.',
      'Each background tile picks one palette through its map attribute.',
      'Rules: Pan Docs, palettes (gbdev.io/pandocs/Palettes.html).',
    ],
    advisory: [],
  },
];

export { GAME_BOY_PRESETS };

/* @layer core @kind data */
import type { PlatformPreset } from '../model/preset.type';
import { COLOUR_222, COLOUR_333 } from './colour-models.constants';
import { AREA_TILE_8 } from './area-rules.constants';
import { TIERS_OPEN_SLOT0, TIERS_STRICT } from './rule-tiers.constants';
import { SIZE_SPEC_TILE_SET } from './size-specs.constants';
import { SIZES_GENESIS } from './sprite-sizes.constants';

const SEGA_PRESETS: readonly PlatformPreset[] = [
  {
    id: 'sms',
    name: 'Master System',
    family: 'Master System',
    version: 1,
    kind: 'any',
    banks: { count: 2, size: 16, slot0: 'colour', slot0Forced: false, slot0Shared: false },
    colour: COLOUR_222,
    startPalette: null,
    sizes: SIZE_SPEC_TILE_SET,
    areaRules: [AREA_TILE_8],
    tiers: TIERS_OPEN_SLOT0,
    notes: [
      'Two banks of 16 colours, one for the background and one for sprites. Each colour is 2 bits per channel, 64 colours in total.',
      'Slot 0 of the sprite bank is not drawn, so set slot 0 to transparent for sprites.',
      'A background tile may use the sprite bank through a tile attribute bit.',
      'Rules: SMS Power, palette page (smspower.org/Development/Palette).',
    ],
    advisory: [
      'Sprites are 8x8 or 8x16 for the whole project.',
      'The hardware draws 8 sprites per scanline and 64 in total.',
    ],
  },
  {
    id: 'genesis',
    name: 'Mega Drive and Genesis',
    family: 'Genesis',
    version: 1,
    kind: 'any',
    banks: { count: 4, size: 16, slot0: 'transparent', slot0Forced: true, slot0Shared: false },
    colour: COLOUR_333,
    startPalette: null,
    sizes: { tile: [8, 8], sprites: SIZES_GENESIS, canvasDefault: [16, 16] },
    areaRules: [AREA_TILE_8],
    tiers: TIERS_STRICT,
    notes: [
      'Four banks of 16 colours at 3 bits per channel, 512 colours in total. Slot 0 of every bank is transparent, so 61 colours are visible.',
      'Each tile and each sprite picks one bank. Sprites are 1 to 4 tiles each way.',
      'Colour levels are the linear steps 00 24 49 6d 92 b6 db ff. Real consoles use a nonlinear DAC.',
      'Rules: Sega Retro and Plutiedev VDP documentation.',
    ],
    advisory: ['Shadow and highlight mode adds tinted variants and is not modelled.'],
  },
];

export { SEGA_PRESETS };

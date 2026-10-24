/* @layer core @kind data */
import type { PlatformPreset } from '../model/preset.type';
import { COLOUR_555 } from './colour-models.constants';
import { AREA_TILE_8 } from './area-rules.constants';
import { TIERS_STRICT } from './rule-tiers.constants';
import { SIZE_SPEC_TILE_SET } from './size-specs.constants';
import { SIZES_SNES } from './sprite-sizes.constants';

const SNES_PRESETS: readonly PlatformPreset[] = [
  {
    id: 'snes-sprite',
    name: 'SNES sprite 4bpp',
    family: 'SNES',
    version: 1,
    kind: 'sprite',
    banks: { count: 8, size: 16, slot0: 'transparent', slot0Forced: true, slot0Shared: false },
    colour: COLOUR_555,
    startPalette: null,
    sizes: { tile: [8, 8], sprites: SIZES_SNES, canvasDefault: [16, 16] },
    areaRules: [],
    tiers: TIERS_STRICT,
    notes: [
      'Eight sprite banks of 16 colours in 15 bit BGR, 128 visible colours in total. Slot 0 is never drawn.',
      'Each sprite uses one bank.',
      'Two sprite sizes are chosen once per project, from the six documented size pairs. Two undocumented pairs (16x32 with 32x64, and 16x32 with 32x32) are not offered.',
      'Rules: Full SNES documentation by Nocash (problemkaputt.de/fullsnes.htm).',
    ],
    advisory: ['The hardware draws 32 sprites per scanline and 128 in total.'],
  },
  {
    id: 'snes-bg-2bpp',
    name: 'SNES background 2bpp',
    family: 'SNES',
    version: 1,
    kind: 'tile',
    banks: { count: 8, size: 4, slot0: 'transparent', slot0Forced: true, slot0Shared: false },
    colour: COLOUR_555,
    startPalette: null,
    sizes: SIZE_SPEC_TILE_SET,
    areaRules: [AREA_TILE_8],
    tiers: TIERS_STRICT,
    notes: [
      'Banks of four colours in 15 bit BGR. In mode 0 each of the four layers has 8 banks. Palette index 0 shows the backdrop.',
      'Each tile picks one bank. Tiles are 8x8 or 16x16.',
      'Rules: Full SNES documentation by Nocash (problemkaputt.de/fullsnes.htm).',
    ],
    advisory: [],
  },
  {
    id: 'snes-bg-4bpp',
    name: 'SNES background 4bpp',
    family: 'SNES',
    version: 1,
    kind: 'tile',
    banks: { count: 8, size: 16, slot0: 'transparent', slot0Forced: true, slot0Shared: false },
    colour: COLOUR_555,
    startPalette: null,
    sizes: SIZE_SPEC_TILE_SET,
    areaRules: [AREA_TILE_8],
    tiers: TIERS_STRICT,
    notes: [
      'Eight banks per layer of 16 colours in 15 bit BGR, used by modes 1 to 6.',
      'Each tile picks one bank. Tiles are 8x8 or 16x16.',
      'Rules: Full SNES documentation by Nocash (problemkaputt.de/fullsnes.htm).',
    ],
    advisory: [],
  },
  {
    id: 'snes-bg-8bpp',
    name: 'SNES background 8bpp',
    family: 'SNES',
    version: 1,
    kind: 'tile',
    banks: { count: 1, size: 256, slot0: 'transparent', slot0Forced: true, slot0Shared: false },
    colour: COLOUR_555,
    startPalette: null,
    sizes: SIZE_SPEC_TILE_SET,
    areaRules: [],
    tiers: TIERS_STRICT,
    notes: [
      'One bank of 256 colours in 15 bit BGR, used by modes 3, 4 and 7. Sprites share this colour memory, and 128 entries are reserved for them in practice.',
      'Direct colour mode is not modelled.',
      'Rules: Full SNES documentation by Nocash (problemkaputt.de/fullsnes.htm).',
    ],
    advisory: [],
  },
];

export { SNES_PRESETS };
